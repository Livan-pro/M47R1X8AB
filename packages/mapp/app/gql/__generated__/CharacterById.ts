/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Profession } from "./globalTypes";

// ====================================================
// GraphQL query operation: CharacterById
// ====================================================

export interface CharacterById_character_location {
  __typename: "Location";
  name: string;
}

export interface CharacterById_character_properties {
  __typename: "Property";
  name: string;
  value: string;
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
  properties: CharacterById_character_properties[];
}

export interface CharacterById {
  character: CharacterById_character | null;
}

export interface CharacterByIdVariables {
  id: number;
}
