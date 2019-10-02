import { Container, Service, Inject } from "typedi";
import { CharacterStateService } from "./services/character-state";
import { IService } from "./service.interface";
import { Logger } from "pino";
import { CharacterImplantsService } from "./services/character-implants";
import { HomelessPollutionService } from "./services/homeless-pollution";

@Service()
export class AppService {
  private readonly serviceTypes = [
    CharacterStateService,
    CharacterImplantsService,
    HomelessPollutionService,
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