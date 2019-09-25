import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User, UserRole, CharacterState, CharacterRole, Profession } from "matrix-database";
import { GqlAuthGuard } from "./gql-auth.guard";
import { RolesDecoratorData } from "./roles.decorator";

interface ISeparatedRoles {
  user: UserRole[];
  character: CharacterRole[];
  professions: Profession[];
  states: CharacterState[];
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
          rolesAnd.professions.length &&
          (!user.mainCharacter || !user.mainCharacter.profession || !rolesAnd.professions.includes(user.mainCharacter.profession))
        ) || (
          rolesAnd.states.length &&
          (!user.mainCharacter || !user.mainCharacter.state || !rolesAnd.states.includes(user.mainCharacter.state))
        )) continue;
        continue or;
      }
      return false;
    }
    return true;
  }

  getRolesDecoratorArray(context: ExecutionContext): ISeparatedRoles[][] | false {
    const classValue = this.reflector.get<RolesDecoratorData>("roles", context.getClass());
    const handlerValue = this.reflector.get<RolesDecoratorData>("roles", context.getHandler());
    if (!classValue && !handlerValue) return false;
    const value: ISeparatedRoles[][] = [];
    for (const val of [classValue, handlerValue]) {
      if (!Array.isArray(val)) continue;
      if (val.length < 1) continue;
      if (Array.isArray(val[0])) value.push((val as Array<Array<UserRole | CharacterRole>>).map(arr => this.separateRoles(arr)));
      else value.push([this.separateRoles(val as Array<UserRole | CharacterRole>)]);
    }
    return value;
  }

  separateRoles(input: Array<UserRole | CharacterRole>): ISeparatedRoles {
    return input.reduce((acc, r) => {
      if (UserRole[r]) acc.user.push(r);
      else if (CharacterRole[r]) acc.character.push(r);
      else if (Profession[r]) acc.professions.push(r);
      else if (CharacterState[r]) acc.states.push(r);
      return acc;
    }, {user: [], character: [], professions: [], states: []});
  }
}
