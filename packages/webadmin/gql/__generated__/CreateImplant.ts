/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FullImplantInput, ImplantType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateImplant
// ====================================================

export interface CreateImplant_createImplant {
  __typename: "Implant";
  id: number;
  name: string | null;
  type: ImplantType | null;
  working: boolean | null;
  quality: boolean | null;
}

export interface CreateImplant {
  createImplant: CreateImplant_createImplant;
}

export interface CreateImplantVariables {
  data: FullImplantInput;
}
