/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Profession, CharacterState } from "./globalTypes";

// ====================================================
// GraphQL query operation: MainCharacter
// ====================================================

export interface MainCharacter_me_mainCharacter_location {
  __typename: "Location";
  name: string;
}

export interface MainCharacter_me_mainCharacter {
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
  location: MainCharacter_me_mainCharacter_location | null;
}

export interface MainCharacter_me {
  __typename: "User";
  mainCharacter: MainCharacter_me_mainCharacter | null;
}

export interface MainCharacter {
  me: MainCharacter_me | null;
}
