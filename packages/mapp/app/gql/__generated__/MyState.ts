/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { CharacterState } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyState
// ====================================================

export interface MyState_me_mainCharacter {
  __typename: "Character";
  state: CharacterState | null;
}

export interface MyState_me {
  __typename: "User";
  mainCharacter: MyState_me_mainCharacter | null;
}

export interface MyState {
  me: MyState_me | null;
}
