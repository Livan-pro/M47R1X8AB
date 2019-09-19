import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User, UserRole, CharacterState, CharacterRole, Profession } from "matrix-database";
import { GqlAuthGuard } from "./gql-auth.guard";
import { RolesDecoratorData } from "./roles.decorator";

interface ISeparatedRoles {
  user: UserRole[];
  character: CharacterRole[];
  professions: Profession[];
}

@Injectable()
export class MyGuard extends GqlAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /* Logic:
    1. if roles & states not defined => return true
    2. if JWT is missing or invalid => return false
    3. if roles defined => check user & character roles & character profession
    4. if states defined => check character state
    5. if all ok => return true
  */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.getRolesDecoratorArray(context);
    const states = this.getDecoratorArray<CharacterState>(context, "states");
    if (!roles && !states) return true;
    if (!await super.canActivate(context)) return false;
    const user = this.getRequest(context).user as User;
    if (!user) return false;
    if (roles) {
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
          )) continue;
          continue or;
        }
        return false;
      }
    }
    return (!states || (user.mainCharacter && user.mainCharacter.state && states.includes(user.mainCharacter.state)));
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
      return acc;
    }, {user: [], character: [], professions: []});
  }
}
