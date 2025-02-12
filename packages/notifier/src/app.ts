import { Container, Service, Inject } from "typedi";
import { IService } from "./service.interface";
import { Logger } from "pino";
import { NotifierService } from "./services/notifier";
import { TokenCacheService } from "./services/token-cache";
import { CharacterCacheService } from "./services/character-cache";

@Service()
export class AppService {
  private readonly serviceTypes = [
    CharacterCacheService,
    TokenCacheService,
    NotifierService,
  ];

  private services: IService[];
  private log: Logger;

  constructor(
    @Inject("LOGGER") logger: Logger,
  ) {
    this.services = this.serviceTypes.map(type => Container.get<IService>(type));
    this.log = logger.child({scope: AppService.name});
  }

  async init() {
    for (const s of this.services) {
      if (!s.init) return null;
      await s.init();
      this.log.info(s.constructor.name + " initialized");
    }
  }
}