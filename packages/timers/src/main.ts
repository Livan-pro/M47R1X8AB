import "reflect-metadata";
import { Config } from "./config";
import {Container} from "typedi";
import * as pino from "pino";
import * as NATS from "nats";
import { createConnection } from "typeorm";
import { AppService } from "./app";

async function bootstrap() {
  const logger = pino({level: "trace", name: "Timers"});
  logger.info("Starting...");

  try {
    Container.set("LOGGER", logger);
    
    const nats = NATS.connect({url: Config.get("NATS_URL"), json: true});
    logger.info("NATS connected");
    Container.set("NATS", nats);

    const connection = await createConnection();
    logger.info("Database connected");
    Container.set("CONNECTION", connection);

    const app = Container.get(AppService);
    await app.init();
  } catch(err) {
    logger.fatal(err);
  }
}
bootstrap();