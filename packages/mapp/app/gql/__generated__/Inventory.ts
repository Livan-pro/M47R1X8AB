/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Inventory
// ====================================================

export interface Inventory_inventory {
  __typename: "InventoryItem";
  itemId: number;
  amount: number;
}

export interface Inventory {
  inventory: Inventory_inventory[];
}
