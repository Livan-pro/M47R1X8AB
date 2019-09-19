import { SetMetadata } from "@nestjs/common";
import { UserRole, CharacterRole } from "matrix-database";

/*
If roles is Array<UserRole | CharacterRole>:
  User should have all user roles from array and main character should have all character roles from array
If roles is Array<Array<UserRole | CharacterRole>>:
  Same conditions for each Array<UserRole | CharacterRole> connected with OR
Roles for class and method connected with AND

Example:
class-level @Roles(UserRole.LoggedIn)
method-level @Roles([UserRole.Admin, CharacterRole.Medic], [UserRole.SuperAdmin])
User should be logged in and ( (should have Admin role and main character should have Medic role) or (user should have SuperAdmin role) )
*/

export type RolesDecoratorData = Array<Array<UserRole | CharacterRole>> | Array<UserRole | CharacterRole>;

// tslint:disable-next-line: variable-name
export const Roles = (...roles: RolesDecoratorData) => SetMetadata("roles", roles);
