import { SetMetadata } from "@nestjs/common";
import { UserRole, CharacterRole, Profession, CharacterState } from "matrix-database";

/*
User should have all (user roles, character roles, one of professions, one of states) from at least one of ISeparatedRoles
Roles for class and method connected with AND

Example:
class-level @Roles({user: UserRole.LoggedIn})
method-level @Roles({user: UserRole.Admin, character: CharacterRole.Medic}, {user: UserRole.SuperAdmin})
User should be logged in and ( (should have Admin role and main character should have Medic role) or (user should have SuperAdmin role) )
*/

export interface ISeparatedRoles {
  user?: UserRole[] | UserRole;
  character?: CharacterRole[] | CharacterRole;
  profession?: Profession[] | Profession;
  state?: CharacterState[] | CharacterState;
}
export type RolesDecoratorData = ISeparatedRoles[];

// tslint:disable-next-line: variable-name
export const Roles = (...roles: ISeparatedRoles[]) => SetMetadata("roles", roles);
