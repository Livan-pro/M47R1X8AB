/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CharacterState } from "./globalTypes";

// ====================================================
// GraphQL query operation: MedicalInfoById
// ====================================================

export interface MedicalInfoById_medicalInfo {
  __typename: "Character";
  id: number;
  state: CharacterState | null;
  pollution: number | null;
  implantsRejectTime: any | null;
}

export interface MedicalInfoById {
  medicalInfo: MedicalInfoById_medicalInfo | null;
}

export interface MedicalInfoByIdVariables {
  id: number;
}
