/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddBalance
// ====================================================

export interface AddBalance_addBalance {
  __typename: "Character";
  id: number;
  balance: number | null;
}

export interface AddBalance {
  addBalance: AddBalance_addBalance | null;
}

export interface AddBalanceVariables {
  id: number;
  amount: number;
}
