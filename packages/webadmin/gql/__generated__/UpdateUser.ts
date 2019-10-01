/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EditUserInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateUser {
  __typename: "User";
  id: number;
}

export interface UpdateUser {
  updateUser: UpdateUser_updateUser | null;
}

export interface UpdateUserVariables {
  id: number;
  data: EditUserInput;
}
