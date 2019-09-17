/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Profession, CharacterState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetMainCharacter
// ====================================================

export interface SetMainCharacter_setMainCharacter {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
  balance: number | null;
  profession: Profession | null;
  professionLevel: number | null;
  state: CharacterState | null;
  pollution: number | null;
  deathTime: any | null;
  implantsRejectTime: any | null;
}

export interface SetMainCharacter {
  setMainCharacter: SetMainCharacter_setMainCharacter | null;
}

export interface SetMainCharacterVariables {
  id: number;
}
