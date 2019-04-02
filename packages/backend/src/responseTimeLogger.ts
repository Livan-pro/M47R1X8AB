import { Request, Response } from "express";
import { Logger } from "@nestjs/common";

const log = new Logger("ResponseTime");

export default (req: Request, res: Response, next: () => void) => {
  const start = Date.now();
  res.on("finish", () => {
      const duration = Date.now() - start;
      log.log(`Response time: ${duration}ms`);
  });
  next();
};
