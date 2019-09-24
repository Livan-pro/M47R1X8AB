/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Medpacks
// ====================================================

export interface Medpacks_medpacks_usedBy {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface Medpacks_medpacks {
  __typename: "Medpack";
  id: number;
  createdAt: any;
  code: string;
  usedBy: Medpacks_medpacks_usedBy | null;
  usedAt: any | null;
}

export interface Medpacks {
  medpacks: Medpacks_medpacks[] | null;
}
