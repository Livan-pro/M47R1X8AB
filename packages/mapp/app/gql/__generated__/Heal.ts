/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CharacterState } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: Heal
// ====================================================

export interface Heal_heal {
  __typename: "Character";
  id: number;
  state: CharacterState | null;
}

export interface Heal {
  heal: Heal_heal | null;
}

export interface HealVariables {
  id: number;
}
