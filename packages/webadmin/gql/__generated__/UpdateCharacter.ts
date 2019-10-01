/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FullCharacterInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateCharacter
// ====================================================

export interface UpdateCharacter_updateCharacter {
  __typename: "Character";
  id: number;
}

export interface UpdateCharacter {
  updateCharacter: UpdateCharacter_updateCharacter | null;
}

export interface UpdateCharacterVariables {
  id: number;
  data: FullCharacterInput;
}
