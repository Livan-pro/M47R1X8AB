import { Get, Controller, Res } from "@nestjs/common";
import { Response } from "express";

@Controller()
export class AppController {
  @Get()
  root(): string {
    return "OK";
  }

  @Get("app")
  app(@Res() res: Response): void {
    res.redirect("/data/app/matrix8ab-v1.4.3.apk", 302);
  }
}
