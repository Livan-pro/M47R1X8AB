/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Profession } from "./globalTypes";

// ====================================================
// GraphQL query operation: CharacterInfoById
// ====================================================

export interface CharacterInfoById_character {
  __typename: "Character";
  id: number;
  name: string;
  own: boolean;
  avatarUploadedAt: any | null;
  profession: Profession | null;
  professionLevel: number | null;
}

export interface CharacterInfoById {
  character: CharacterInfoById_character | null;
}

export interface CharacterInfoByIdVariables {
  id: number;
}
