/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: login
// ====================================================

export interface login_login {
  __typename: "LoginResult";
  email: string;
}

export interface login {
  login: login_login;
}

export interface loginVariables {
  email: string;
  password: string;
  rememberMe?: boolean | null;
}
