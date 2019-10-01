/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UserRole, CharacterRole, Profession } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyRoles
// ====================================================

export interface MyRoles_me_mainCharacter {
  __typename: "Character";
  id: number;
  roles: CharacterRole[] | null;
  profession: Profession | null;
}

export interface MyRoles_me {
  __typename: "User";
  roles: UserRole[] | null;
  mainCharacter: MyRoles_me_mainCharacter | null;
}

export interface MyRoles {
  me: MyRoles_me | null;
}
