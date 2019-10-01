/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ImplantProlongations
// ====================================================

export interface ImplantProlongations_implantProlongations_usedBy {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface ImplantProlongations_implantProlongations {
  __typename: "ImplantProlongation";
  id: number;
  createdAt: any;
  code: string;
  usedBy: ImplantProlongations_implantProlongations_usedBy | null;
  usedAt: any | null;
  time: number;
}

export interface ImplantProlongations {
  implantProlongations: ImplantProlongations_implantProlongations[] | null;
}
