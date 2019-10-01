/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UserRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyRoles
// ====================================================

export interface MyRoles_me {
  __typename: "User";
  roles: UserRole[] | null;
}

export interface MyRoles {
  me: MyRoles_me | null;
}
