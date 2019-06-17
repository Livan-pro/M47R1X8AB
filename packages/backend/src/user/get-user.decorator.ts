import { createParamDecorator } from "@nestjs/common";
import { User } from "matrix-database";

// tslint:disable-next-line:variable-name
export const GetUser = createParamDecorator(
  (data, [root, args, ctx, info]): User => ctx.req.user,
);
