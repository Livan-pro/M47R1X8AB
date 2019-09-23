import { SetMetadata } from "@nestjs/common";
import { UserRole, CharacterRole, Profession, CharacterState } from "matrix-database";

/*
If roles is Array<Value>:
  User should have all user roles from array and main character should have all character roles, profession and state from array
If roles is Array<Array<Value>>:
  Same conditions for each Array<Value> connected with OR
Roles for class and method connected with AND

Example:
class-level @Roles(UserRole.LoggedIn)
method-level @Roles([UserRole.Admin, CharacterRole.Medic], [UserRole.SuperAdmin])
User should be logged in and ( (should have Admin role and main character should have Medic role) or (user should have SuperAdmin role) )
*/

export type Value = UserRole | CharacterRole | Profession | CharacterState;
export type RolesDecoratorData = Value[][] | Value[];

// tslint:disable-next-line: variable-name
export const Roles = (...roles: RolesDecoratorData) => SetMetadata("roles", roles);
