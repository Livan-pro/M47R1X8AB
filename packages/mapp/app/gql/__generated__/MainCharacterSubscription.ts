/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Profession, CharacterState } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: MainCharacterSubscription
// ====================================================

export interface MainCharacterSubscription_mainCharacter {
  __typename: "CharacterUpdate";
  id: number | null;
  name: string | null;
  avatarUploadedAt: any | null;
  balance: number | null;
  profession: Profession | null;
  professionLevel: number | null;
  state: CharacterState | null;
  pollution: number | null;
  deathTime: any | null;
}

export interface MainCharacterSubscription {
  mainCharacter: MainCharacterSubscription_mainCharacter | null;
}
