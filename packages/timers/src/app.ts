import { Container, Service, Inject } from "typedi";
import { CharacterService } from "./services/character";
import { IService } from "./service.interface";
import { Logger } from "pino";

@Service()
export class AppService {
  private readonly serviceTypes = [
    CharacterService,
  ];

  private services: IService[];
  private log: Logger;

  constructor(
    @Inject("LOGGER") logger: Logger,
  ) {
    this.services = this.serviceTypes.map(type => Container.get(type));
    this.log = logger.child({scope: AppService.name});
  }

  async init() {
    this.services.map(async s => {
      if (!s.init) return null;
      await s.init();
      this.log.info(s.constructor.name + " initialized");
    });
  }
}