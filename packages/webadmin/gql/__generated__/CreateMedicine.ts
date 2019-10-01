/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateMedicine
// ====================================================

export interface CreateMedicine_createMedicine_usedBy {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface CreateMedicine_createMedicine {
  __typename: "Medicine";
  id: number;
  createdAt: any;
  code: string;
  usedBy: CreateMedicine_createMedicine_usedBy | null;
  usedAt: any | null;
}

export interface CreateMedicine {
  createMedicine: CreateMedicine_createMedicine;
}

export interface CreateMedicineVariables {
  code: string;
}
