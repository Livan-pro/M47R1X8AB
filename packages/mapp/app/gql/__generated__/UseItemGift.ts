/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UseItemGift
// ====================================================

export interface UseItemGift_useItemGift {
  __typename: "InventoryItem";
  itemId: number;
  amount: number;
}

export interface UseItemGift {
  useItemGift: UseItemGift_useItemGift | null;
}

export interface UseItemGiftVariables {
  code: string;
}
