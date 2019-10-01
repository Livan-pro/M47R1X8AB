/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyBalance
// ====================================================

export interface MyBalance_me_mainCharacter {
  __typename: "Character";
  balance: number | null;
}

export interface MyBalance_me {
  __typename: "User";
  mainCharacter: MyBalance_me_mainCharacter | null;
}

export interface MyBalance {
  me: MyBalance_me | null;
}
