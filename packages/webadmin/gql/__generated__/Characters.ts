/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CharacterRole, Profession, CharacterState } from "./globalTypes";

// ====================================================
// GraphQL query operation: Characters
// ====================================================

export interface Characters_characters_location {
  __typename: "Location";
  name: string | null;
}

export interface Characters_characters {
  __typename: "Character";
  id: number;
  userId: number | null;
  name: string;
  quenta: string | null;
  roles: CharacterRole[] | null;
  profession: Profession | null;
  registrationProfession: Profession | null;
  professionLevel: number | null;
  avatarUploadedAt: any | null;
  balance: number | null;
  state: CharacterState | null;
  pollution: number | null;
  deathTime: any | null;
  implantsRejectTime: any | null;
  location: Characters_characters_location | null;
}

export interface Characters {
  characters: Characters_characters[];
}
