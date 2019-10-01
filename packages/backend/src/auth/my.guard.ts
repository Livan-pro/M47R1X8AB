import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User, UserRole, CharacterState, CharacterRole, Profession } from "matrix-database";
import { GqlAuthGuard } from "./gql-auth.guard";
import { ISeparatedRoles, RolesDecoratorData } from "./roles.decorator";

interface INormalizedRoles {
  user: UserRole[];
  character: CharacterRole[];
  profession: Profession[];
  state: CharacterState[];
}

@Injectable()
export class MyGuard extends GqlAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /* Logic:
    1. if roles not defined => return true
    2. if JWT is missing or invalid => return false
    3. if roles defined => check user & character roles & character profession & character state
    4. if all ok => return true
  */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.getRolesDecoratorArray(context);
    if (!roles) return true;
    if (!await super.canActivate(context)) return false;
    const user = this.getRequest(context).user as User;
    if (!user) return false;
    or: for (const rolesOr of roles) {
      for (const rolesAnd of rolesOr) {
        if ((
          rolesAnd.user.length &&
          (!user.roles || !user.roles.has(rolesAnd.user))
        ) || (
          rolesAnd.character.length &&
          (!user.mainCharacter || !user.mainCharacter.roles || !user.mainCharacter.roles.has(rolesAnd.character))
        ) || (
          rolesAnd.profession.length &&
          (!user.mainCharacter || !user.mainCharacter.profession || !rolesAnd.profession.includes(user.mainCharacter.profession))
        ) || (
          rolesAnd.state.length &&
          (!user.mainCharacter || !user.mainCharacter.state || !rolesAnd.state.includes(user.mainCharacter.state))
        )) continue;
        continue or;
      }
      return false;
    }
    return true;
  }

  getRolesDecoratorArray(context: ExecutionContext): INormalizedRoles[][] | false {
    const classValue = this.reflector.get<RolesDecoratorData>("roles", context.getClass());
    const handlerValue = this.reflector.get<RolesDecoratorData>("roles", context.getHandler());
    if (!classValue && !handlerValue) return false;
    const value: INormalizedRoles[][] = [];
    for (const val of [classValue, handlerValue]) {
      if (!Array.isArray(val)) continue;
      if (val.length < 1) continue;
      value.push(this.normalizeRoles(val));
    }
    return value;
  }

  normalizeRoles(input: ISeparatedRoles[]): INormalizedRoles[] {
    return input.map((roles): INormalizedRoles => {
      return {
        user: Array.isArray(roles.user) ? roles.user : (UserRole[roles.user] ? [roles.user] : []),
        character: Array.isArray(roles.character) ? roles.character : (CharacterRole[roles.character] ? [roles.character] : []),
        profession: Array.isArray(roles.profession) ? roles.profession : (Profession[roles.profession] ? [roles.profession] : []),
        state: Array.isArray(roles.state) ? roles.state : (CharacterState[roles.state] ? [roles.state] : []),
      };
    });
  }
}
