/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { LocationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateLocation
// ====================================================

export interface UpdateLocation_updateLocation {
  __typename: "Location";
  id: number | null;
}

export interface UpdateLocation {
  updateLocation: UpdateLocation_updateLocation | null;
}

export interface UpdateLocationVariables {
  id: number;
  data: LocationInput;
}
