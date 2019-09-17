/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ImplantsRejectTime
// ====================================================

export interface ImplantsRejectTime_me_mainCharacter {
  __typename: "Character";
  implantsRejectTime: any | null;
}

export interface ImplantsRejectTime_me {
  __typename: "User";
  mainCharacter: ImplantsRejectTime_me_mainCharacter | null;
}

export interface ImplantsRejectTime {
  me: ImplantsRejectTime_me | null;
}
