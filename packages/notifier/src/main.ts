import "reflect-metadata";
import { Config } from "./config";
import {Container} from "typedi";
import * as pino from "pino";
import * as NATS from "nats";
import * as admin from "firebase-admin";
import { createConnection } from "typeorm";
import { AppService } from "./app";

async function bootstrap() {
  const logger = pino({level: "trace", name: "Notifier"});
  logger.info("Starting...");

  try {
    Container.set("LOGGER", logger);
    
    const nats = NATS.connect({url: Config.get("NATS_URL"), json: true});
    logger.info("NATS connected");
    Container.set("NATS", nats);

    const connection = await createConnection();
    logger.info("Database connected");
    Container.set("CONNECTION", connection);

    const fbApp = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: "https://matrix8ab.firebaseio.com",
    });
    logger.info("Firabase App initialized");
    Container.set("FIREBASE", fbApp);
    Container.set("MESSAGING", admin.messaging(fbApp));

    const app = Container.get(AppService);
    await app.init();
  } catch(err) {
    logger.fatal(err);
  }
}
bootstrap();