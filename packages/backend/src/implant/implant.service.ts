import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, TransactionManager, EntityManager } from "typeorm";
import { Implant, ImplantProlongation, Character } from "matrix-database";
import { Client } from "nats";
import { CustomError } from "CustomError";
import { CharacterUtils } from "bshared";

@Injectable()
export class ImplantService {
  private readonly log = new Logger(ImplantService.name);
  constructor(
    @InjectRepository(Implant)
    private readonly repo: Repository<Implant>,
    @InjectRepository(ImplantProlongation)
    private readonly repoIP: Repository<ImplantProlongation>,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  async getAllImplantProlongations() {
    return this.repoIP.find({relations: ["usedBy"]});
  }

  async createImplantProlongation(code: Buffer, time: number) {
    return this.repoIP.save({code, time});
  }

  async getByCharacterId(characterId: number): Promise<Implant[]> {
    return await this.repo.find({where: {characterId}});
  }

  async create(data: Partial<Implant>): Promise<Implant> {
    const implant = await this.repo.save(this.repo.create(data));
    this.nats.publish("backend.implant.update", implant);
    return implant;
  }

  async update(id: number, data: Partial<Implant>): Promise<Partial<Implant>> {
    const implant = this.repo.create(data);
    await this.repo.update(id, implant);
    const update = {...implant, id};
    this.nats.publish("backend.implant.update", update);
    return update;
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
      select: ["id", "implantsRejectTime"],
      lock: {mode: "pessimistic_write"},
    });

    const iRepo = manager.getRepository(Implant);
    const implants = await iRepo.find({
      where: {characterId, quality: false},
      select: ["id"],
      lock: {mode: "pessimistic_write"},
    });
    if (!implants || !implants.length) throw new CustomError("Нет имплантов для продления");

    const data = {implantsRejectTime: CharacterUtils.getNewRejectTime(char.implantsRejectTime, implantProlongation.time)};
    await cRepo.update(characterId, data);
    await repo.update(implantProlongation.id, {usedById: characterId, usedAt: new Date()});
    this.nats.publish("backend.character.update", {...data, id: characterId});
  }

  @Transaction()
  async fix(
    byCharacterId: number,
    forCharacterId: number,
    @TransactionManager() manager?: EntityManager,
  ) {
    const iRepo = manager.getRepository(Implant);

    const cRepo = manager.getRepository(Character);
    const char = await cRepo.findOneOrFail({id: forCharacterId}, {
      select: ["id", "implantsRejectTime"],
      lock: {mode: "pessimistic_write"},
    });

    const data = {implantsRejectTime: CharacterUtils.getNewRejectTime(char.implantsRejectTime, CharacterUtils.getMedicRejectTime())};
    await cRepo.update(forCharacterId, data);
    await iRepo.update({characterId: forCharacterId, working: false}, {working: true});
    this.nats.publish("backend.character.update", {...data, id: forCharacterId});
  }
}
