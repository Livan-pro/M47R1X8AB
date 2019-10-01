/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ImplantType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Implants
// ====================================================

export interface Implants_implants {
  __typename: "Implant";
  id: number;
  name: string | null;
  type: ImplantType | null;
  working: boolean | null;
  quality: boolean | null;
}

export interface Implants {
  implants: Implants_implants[];
}

export interface ImplantsVariables {
  id?: number | null;
}
