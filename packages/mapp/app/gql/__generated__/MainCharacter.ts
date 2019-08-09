/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MainCharacter
// ====================================================

export interface MainCharacter_me_mainCharacter {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
  balance: number | null;
}

export interface MainCharacter_me {
  __typename: "User";
  mainCharacter: MainCharacter_me_mainCharacter | null;
}

export interface MainCharacter {
  me: MainCharacter_me | null;
}
