import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User, Role } from "matrix-database";
import { GqlAuthGuard } from "./gql-auth.guard";

@Injectable()
export class RolesGuard extends GqlAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesClass = this.reflector.get<Role[]>("roles", context.getClass());
    const rolesHandler = this.reflector.get<Role[]>("roles", context.getHandler());
    if (!rolesClass && !rolesHandler) return true;
    const roles = [];
    if (Array.isArray(rolesClass)) roles.push(rolesClass);
    if (Array.isArray(rolesHandler)) roles.push(rolesHandler);
    if (!await super.canActivate(context)) return false;
    const user = this.getRequest(context).user as User;
    if (!user) return false;
    return user.roles && user.roles.has(roles);
  }
}
