/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetMainCharacter
// ====================================================

export interface SetMainCharacter_setMainCharacter {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
  balance: number | null;
}

export interface SetMainCharacter {
  setMainCharacter: SetMainCharacter_setMainCharacter | null;
}

export interface SetMainCharacterVariables {
  id: number;
}
