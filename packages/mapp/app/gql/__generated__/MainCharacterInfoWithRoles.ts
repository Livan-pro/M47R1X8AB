/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UserRole, CharacterRole, Profession } from "./globalTypes";

// ====================================================
// GraphQL query operation: MainCharacterInfoWithRoles
// ====================================================

export interface MainCharacterInfoWithRoles_me_mainCharacter {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
  own: boolean;
  roles: CharacterRole[] | null;
  profession: Profession | null;
}

export interface MainCharacterInfoWithRoles_me {
  __typename: "User";
  roles: UserRole[] | null;
  mainCharacter: MainCharacterInfoWithRoles_me_mainCharacter | null;
}

export interface MainCharacterInfoWithRoles {
  me: MainCharacterInfoWithRoles_me | null;
}
