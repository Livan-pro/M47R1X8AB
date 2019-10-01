/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Medicines
// ====================================================

export interface Medicines_medicines_usedBy {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface Medicines_medicines {
  __typename: "Medicine";
  id: number;
  createdAt: any;
  code: string;
  usedBy: Medicines_medicines_usedBy | null;
  usedAt: any | null;
}

export interface Medicines {
  medicines: Medicines_medicines[] | null;
}
