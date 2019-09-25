/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LocationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateLocation
// ====================================================

export interface CreateLocation_createLocation {
  __typename: "Location";
  id: number | null;
  name: string;
}

export interface CreateLocation {
  createLocation: CreateLocation_createLocation | null;
}

export interface CreateLocationVariables {
  data: LocationInput;
}
