/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CharacterAdditionalInfoById
// ====================================================

export interface CharacterAdditionalInfoById_addinfo_location {
  __typename: "Location";
  name: string;
}

export interface CharacterAdditionalInfoById_addinfo_properties {
  __typename: "Property";
  name: string;
  value: string;
}

export interface CharacterAdditionalInfoById_addinfo {
  __typename: "Character";
  id: number;
  location: CharacterAdditionalInfoById_addinfo_location | null;
  properties: CharacterAdditionalInfoById_addinfo_properties[];
}

export interface CharacterAdditionalInfoById {
  addinfo: CharacterAdditionalInfoById_addinfo | null;
}

export interface CharacterAdditionalInfoByIdVariables {
  id: number;
}
