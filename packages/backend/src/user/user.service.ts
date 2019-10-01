import { Injectable, Logger, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Transaction, TransactionManager, EntityManager, TransactionRepository } from "typeorm";
import { User } from "matrix-database";
import { Character } from "matrix-database";
import { FileUpload } from "graphql-upload";
import { FileService } from "file/file.service";
import { Client } from "nats";

@Injectable()
export class UserService {
  private readonly log = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly file: FileService,
    @Inject("NATS")
    private readonly nats: Client,
  ) {}

  async getById(id: number): Promise<User> {
    return await this.repo.findOneOrFail({id});
  }

  async getByEmail(email: string): Promise<User> {
    return await this.repo.findOneOrFail({email});
  }

  async getAllWithMainCharacter(): Promise<User[]> {
    return await this.repo.find({relations: ["mainCharacter"]});
  }

  async getByEmailWithRelations(email: string, relations: string[]): Promise<User> {
    const user = await this.repo.findOneOrFail({email}, {
      relations,
    });
    return user;
  }

  async getByEmailWithCharacter(email: string): Promise<User> {
    return this.getByEmailWithRelations(email, ["mainCharacter"]);
  }

  @Transaction()
  async createWithCharacter(
    userData: Partial<User>,
    characterData: Partial<Character> & {quenta: Promise<FileUpload> | null},
    @TransactionManager() manager?: EntityManager,
  ): Promise<{user: User, character: Character}> {
    const user = manager.getRepository(User).create(userData);
    await manager.save(user);

    const quenta = await (characterData.quenta as unknown as FileUpload);
    const character = manager.getRepository(Character).create({...characterData, quenta: quenta && quenta.filename});
    character.userId = user.id;
    await manager.save(character);
    user.mainCharacter = character;
    await manager.save(user);

    if (quenta && quenta.filename) {
      this.log.log("Uploading file...");
      await this.file.upload(quenta, ["quenta", character.id.toString(), quenta.filename]);
      this.log.log("Done!");
    }

    this.log.log(`User created: ${user.email}`);
    return {user, character};
  }

  async update(userId: number, data: Partial<User>): Promise<void> {
    const user = this.repo.create(data);
    await this.repo.update(userId, user);
    this.nats.publish("backend.user.update", {...user, id: userId});
  }
}
