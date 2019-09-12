/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MainCharacterInfo
// ====================================================

export interface MainCharacterInfo_me_mainCharacter {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
  own: boolean;
}

export interface MainCharacterInfo_me {
  __typename: "User";
  mainCharacter: MainCharacterInfo_me_mainCharacter | null;
}

export interface MainCharacterInfo {
  me: MainCharacterInfo_me | null;
}
