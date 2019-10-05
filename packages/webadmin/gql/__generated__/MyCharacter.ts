/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyCharacter
// ====================================================

export interface MyCharacter_me_mainCharacter {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface MyCharacter_me {
  __typename: "User";
  mainCharacter: MyCharacter_me_mainCharacter | null;
}

export interface MyCharacter {
  me: MyCharacter_me | null;
}
