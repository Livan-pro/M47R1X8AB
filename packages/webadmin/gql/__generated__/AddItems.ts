/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddItems
// ====================================================

export interface AddItems_addItems {
  __typename: "InventoryItem";
  itemId: number;
  amount: number;
}

export interface AddItems {
  addItems: AddItems_addItems;
}

export interface AddItemsVariables {
  characterId: number;
  itemId: number;
  amount: number;
}
