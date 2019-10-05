/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CharactersInfo
// ====================================================

export interface CharactersInfo_characters {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface CharactersInfo {
  characters: CharactersInfo_characters[];
}
