import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, EntityManager, TransactionManager } from "typeorm";
import { Character, CharacterState, Medicine, Medpack } from "matrix-database";
import { Client } from "nats";
import { CustomError } from "CustomError";

@Injectable()
export class MedicineService {
  private readonly log = new Logger(MedicineService.name);
  constructor(
    @InjectRepository(Medicine)
    private readonly repo: Repository<Medicine>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  @Transaction()
  async useMedicine(
    code: Buffer,
    characterId: number,
    @TransactionManager() manager?: EntityManager,
  ): Promise<void> {
    const repo = manager.getRepository(Medicine);
    let medicine: Medicine;
    try {
      medicine = await repo.findOneOrFail({code, usedById: null}, {lock: {mode: "pessimistic_write"}});
    } catch (e) {
      throw new CustomError("Лекарство не найдено или уже использовано!");
    }

    const cRepo = manager.getRepository(Character);
    const char = await cRepo.findOneOrFail({id: characterId}, {
      select: ["state", "pollution", "pollutionStartTime", "deathTime"],
      lock: {mode: "pessimistic_write"},
    });

    if (char.state !== CharacterState.Pollution) {
      throw new CustomError("Вам не требуется лекарство!");
    }

    const data = {state: CharacterState.Normal, pollution: 0, pollutionStartTime: null};
    await cRepo.update(characterId, data);
    await repo.update(medicine.id, {usedById: characterId, usedAt: new Date()});
    this.nats.publish("backend.character.update", {...data, id: characterId});
  }

  @Transaction()
  async useMedpack(
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
