import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User, UserRole, CharacterState } from "matrix-database";
import { GqlAuthGuard } from "./gql-auth.guard";

@Injectable()
export class MyGuard extends GqlAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /* Logic:
    1. if roles & states not defined => return true
    2. if JWT is missing or invalid => return false
    3. if roles defined => check user roles
    4. if states defined => check character state
    5. if all ok => return true
  */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.getDecoratorArray<UserRole>(context, "roles");
    const states = this.getDecoratorArray<CharacterState>(context, "states");
    if (!roles && !states) return true;
    if (!await super.canActivate(context)) return false;
    const user = this.getRequest(context).user as User;
    if (!user) return false;
    return (!roles || (user.roles && user.roles.has(roles as UserRole[]))) &&
      (!states || (user.mainCharacter && user.mainCharacter.state && states.includes(user.mainCharacter.state)));
  }

  getDecoratorArray<T>(context: ExecutionContext, name: string): T[] | false {
    const classValue = this.reflector.get<T[]>(name, context.getClass());
    const handlerValue = this.reflector.get<T[]>(name, context.getHandler());
    if (!classValue && !handlerValue) return false;
    const value = [];
    if (Array.isArray(classValue)) value.push(...classValue);
    if (Array.isArray(handlerValue)) value.push(...handlerValue);
    return value;
  }
}
