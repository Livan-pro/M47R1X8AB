// tslint:disable-next-line:no-var-requires
require("./tsconfig-paths-bootstrap");
import { Config } from "config";
// ^ Needs to be first

import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import responseTimeLogger from "./responseTimeLogger";
import { Logger } from "@nestjs/common";
import * as express from "express";
import { join } from "path";

const log = new Logger("main");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  if (Config.getBoolean("SERVE_DATA")) {
    app.use("/data", express.static(join(__dirname, "..", "data")));
    app.use("/data/avatar", (_, res) => {
      res.redirect(302, "/data/avatar/no-avatar.png");
    });
  }
  if (Config.getBoolean("LOG_RESPONSE_TIME")) app.use(responseTimeLogger);
  const port = Config.getInt("PORT", 3000);
  await app.listen(port, () => log.log(`🚀  Server listening at port ${port}`));
}
bootstrap();
