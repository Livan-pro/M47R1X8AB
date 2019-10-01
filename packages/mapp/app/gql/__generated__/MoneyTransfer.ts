/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MoneyTransfer
// ====================================================

export interface MoneyTransfer_moneyTransfer {
  __typename: "Character";
  id: number;
  balance: number | null;
}

export interface MoneyTransfer {
  moneyTransfer: MoneyTransfer_moneyTransfer | null;
}

export interface MoneyTransferVariables {
  id: number;
  amount: number;
}
