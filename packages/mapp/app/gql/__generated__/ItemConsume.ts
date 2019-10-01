/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ItemConsume
// ====================================================

export interface ItemConsume_consumeItem {
  __typename: "InventoryItem";
  itemId: number;
  amount: number;
}

export interface ItemConsume {
  consumeItem: ItemConsume_consumeItem;
}

export interface ItemConsumeVariables {
  itemId: number;
  amount: number;
}
