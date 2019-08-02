/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { Role } from "./globalTypes";

// ====================================================
// GraphQL query operation: Users
// ====================================================

export interface Users_users_mainCharacter {
  __typename: "Character";
  id: number;
  name: string;
  quenta: string | null;
  avatarUploadedAt: any | null;
}

export interface Users_users {
  __typename: "User";
  id: number;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  vkId: string | null;
  medicalInfo: string | null;
  roles: Role[] | null;
  createdAt: any | null;
  mainCharacter: Users_users_mainCharacter | null;
}

export interface Users {
  users: Users_users[];
}