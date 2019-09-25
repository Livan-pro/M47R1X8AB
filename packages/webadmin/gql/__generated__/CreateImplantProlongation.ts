/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateImplantProlongation
// ====================================================

export interface CreateImplantProlongation_createImplantProlongation_usedBy {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface CreateImplantProlongation_createImplantProlongation {
  __typename: "ImplantProlongation";
  id: number;
  createdAt: any;
  code: string;
  usedBy: CreateImplantProlongation_createImplantProlongation_usedBy | null;
  usedAt: any | null;
  time: number;
}

export interface CreateImplantProlongation {
  createImplantProlongation: CreateImplantProlongation_createImplantProlongation;
}

export interface CreateImplantProlongationVariables {
  code: string;
  time: number;
}
