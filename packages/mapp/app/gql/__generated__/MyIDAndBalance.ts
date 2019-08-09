/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyIDAndBalance
// ====================================================

export interface MyIDAndBalance_me_mainCharacter {
  __typename: "Character";
  id: number;
  balance: number | null;
}

export interface MyIDAndBalance_me {
  __typename: "User";
  mainCharacter: MyIDAndBalance_me_mainCharacter | null;
}

export interface MyIDAndBalance {
  me: MyIDAndBalance_me | null;
}
