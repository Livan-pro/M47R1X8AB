import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, EntityManager, TransactionManager } from "typeorm";
import { Character, CharacterState, Medpack } from "matrix-database";
import { Client } from "nats";
import { CustomError } from "CustomError";

@Injectable()
export class MedpackService {
  private readonly log = new Logger(MedpackService.name);
  constructor(
    @InjectRepository(Medpack)
    private readonly repo: Repository<Medpack>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  @Transaction()
  async use(
    code: Buffer,
    characterId: number,
    @TransactionManager() manager?: EntityManager,
  ): Promise<void> {
    const repo = manager.getRepository(Medpack);
    let medpack: Medpack;
    try {
      medpack = await repo.findOneOrFail({code, usedById: null}, {lock: {mode: "pessimistic_write"}});
    } catch (e) {
      throw new CustomError("Медпак не найден или уже использован!");
    }

    const cRepo = manager.getRepository(Character);
    const char = await cRepo.findOneOrFail({id: characterId}, {
      select: ["state", "pollution", "pollutionStartTime", "deathTime"],
      lock: {mode: "pessimistic_write"},
    });

    if (char.state !== CharacterState.Pollution && char.state !== CharacterState.SevereWound) {
      throw new CustomError("Вам не требуется медпак!");
    }

    const data = {state: CharacterState.Normal, pollution: 0, pollutionStartTime: null, deathTime: null};
    await cRepo.update(characterId, data);
    await repo.update(medpack.id, {usedById: characterId, usedAt: new Date()});
    this.nats.publish("backend.character.update", {...data, id: characterId});
  }
}
