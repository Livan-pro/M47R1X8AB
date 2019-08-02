/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Role } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyRoles
// ====================================================

export interface MyRoles_me {
  __typename: "User";
  roles: Role[] | null;
}

export interface MyRoles {
  me: MyRoles_me | null;
}
