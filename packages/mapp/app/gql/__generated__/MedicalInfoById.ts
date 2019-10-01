/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Profession, CharacterState } from "./globalTypes";

// ====================================================
// GraphQL query operation: MedicalInfoById
// ====================================================

export interface MedicalInfoById_character {
  __typename: "Character";
  id: number;
  name: string;
  own: boolean;
  avatarUploadedAt: any | null;
  profession: Profession | null;
  professionLevel: number | null;
  state: CharacterState | null;
  pollution: number | null;
  implantsRejectTime: any | null;
}

export interface MedicalInfoById {
  character: MedicalInfoById_character | null;
}

export interface MedicalInfoByIdVariables {
  id: number;
}
