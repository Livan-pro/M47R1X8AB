import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, TransactionManager, EntityManager } from "typeorm";
import { Implant, ImplantProlongation, Character } from "matrix-database";
import { Client } from "nats";
import { CustomError } from "CustomError";

@Injectable()
export class ImplantService {
  private readonly log = new Logger(ImplantService.name);
  constructor(
    @InjectRepository(Implant)
    private readonly repo: Repository<Implant>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async getByCharacterId(characterId: number): Promise<Implant[]> {
    return await this.repo.find({where: {characterId}});
  }

  async create(data: Partial<Implant>): Promise<Implant> {
    const implant = await this.repo.save(this.repo.create(data));
    this.nats.publish("backend.implant.update", implant);
    return implant;
  }

  async update(id: number, data: Partial<Implant>): Promise<void> {
    const implant = this.repo.create(data);
    await this.repo.update(id, implant);
    this.nats.publish("backend.implant.update", {...implant, id});
  }

  @Transaction()
  async useProlongation(
    code: Buffer,
    characterId: number,
    @TransactionManager() manager?: EntityManager,
  ): Promise<void> {
    const repo = manager.getRepository(ImplantProlongation);
    let implantProlongation: ImplantProlongation;
    try {
      implantProlongation = await repo.findOneOrFail({code, usedById: null}, {lock: {mode: "pessimistic_write"}});
    } catch (e) {
      throw new CustomError("Код продления не найден или уже использован!");
    }

    const cRepo = manager.getRepository(Character);
    const char = await cRepo.findOneOrFail({id: characterId}, {
      select: ["implantsRejectTime"],
      lock: {mode: "pessimistic_write"},
    });

    const iRepo = manager.getRepository(Implant);

    const data = {implantsRejectTime: new Date(
      (char.implantsRejectTime < new Date() ? Date.now() : char.implantsRejectTime.getTime()) + implantProlongation.time,
    )};
    await iRepo.update({characterId}, {working: true});
    await cRepo.update(characterId, data);
    await repo.update(implantProlongation.id, {usedById: characterId, usedAt: new Date()});
    this.nats.publish("backend.character.update", {...data, id: characterId});
  }
}