/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateMedpack
// ====================================================

export interface CreateMedpack_createMedpack_usedBy {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface CreateMedpack_createMedpack {
  __typename: "Medpack";
  id: number;
  createdAt: any;
  code: string;
  usedBy: CreateMedpack_createMedpack_usedBy | null;
  usedAt: any | null;
}

export interface CreateMedpack {
  createMedpack: CreateMedpack_createMedpack;
}

export interface CreateMedpackVariables {
  code: string;
}
