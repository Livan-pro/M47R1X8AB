/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Profession, CharacterState } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyStateExtended
// ====================================================

export interface MyStateExtended_me_mainCharacter {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
  profession: Profession | null;
  professionLevel: number | null;
  state: CharacterState | null;
  pollution: number | null;
  deathTime: any | null;
}

export interface MyStateExtended_me {
  __typename: "User";
  mainCharacter: MyStateExtended_me_mainCharacter | null;
}

export interface MyStateExtended {
  me: MyStateExtended_me | null;
}
