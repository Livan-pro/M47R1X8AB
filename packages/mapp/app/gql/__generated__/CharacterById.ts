/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Profession } from "./globalTypes";

// ====================================================
// GraphQL query operation: CharacterById
// ====================================================

export interface CharacterById_character_location {
  __typename: "Location";
  name: string | null;
}

export interface CharacterById_character {
  __typename: "Character";
  id: number;
  name: string;
  own: boolean;
  avatarUploadedAt: any | null;
  profession: Profession | null;
  professionLevel: number | null;
  location: CharacterById_character_location | null;
  implantsRejectTime: any | null;
}

export interface CharacterById {
  character: CharacterById_character | null;
}

export interface CharacterByIdVariables {
  id: number;
}
