/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BalanceHistory
// ====================================================

export interface BalanceHistory_allBalanceHistory_from {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface BalanceHistory_allBalanceHistory_to {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface BalanceHistory_allBalanceHistory {
  __typename: "BalanceTransfer";
  id: number;
  createdAt: any;
  from: BalanceHistory_allBalanceHistory_from | null;
  to: BalanceHistory_allBalanceHistory_to;
  amount: number;
}

export interface BalanceHistory {
  allBalanceHistory: BalanceHistory_allBalanceHistory[];
}
