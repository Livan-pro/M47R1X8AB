/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Profession } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyCharacters
// ====================================================

export interface MyCharacters_me_characters {
  __typename: "Character";
  id: number;
  name: string;
  own: boolean;
  avatarUploadedAt: any | null;
  balance: number | null;
  profession: Profession | null;
  professionLevel: number | null;
}

export interface MyCharacters_me {
  __typename: "User";
  characters: (MyCharacters_me_characters | null)[] | null;
}

export interface MyCharacters {
  me: MyCharacters_me | null;
}
