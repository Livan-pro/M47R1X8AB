/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetLocation
// ====================================================

export interface SetLocation_updateCharacter_location {
  __typename: "Location";
  id: number | null;
  name: string;
}

export interface SetLocation_updateCharacter {
  __typename: "Character";
  id: number;
  location: SetLocation_updateCharacter_location | null;
}

export interface SetLocation {
  updateCharacter: SetLocation_updateCharacter | null;
}

export interface SetLocationVariables {
  id: number;
  locationId: number;
}
