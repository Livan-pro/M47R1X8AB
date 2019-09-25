/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { FullImplantInput, ImplantType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateImplant
// ====================================================

export interface UpdateImplant_updateImplant {
  __typename: "Implant";
  id: number;
  name: string | null;
  type: ImplantType | null;
  working: boolean | null;
  quality: boolean | null;
}

export interface UpdateImplant {
  updateImplant: UpdateImplant_updateImplant;
}

export interface UpdateImplantVariables {
  id: number;
  data: FullImplantInput;
}
