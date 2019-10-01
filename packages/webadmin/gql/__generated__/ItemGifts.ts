/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ItemGifts
// ====================================================

export interface ItemGifts_itemGifts_usedBy {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface ItemGifts_itemGifts {
  __typename: "ItemGift";
  id: number;
  createdAt: any;
  code: string;
  usedBy: ItemGifts_itemGifts_usedBy | null;
  usedAt: any | null;
  itemId: number;
  amount: number;
}

export interface ItemGifts {
  itemGifts: ItemGifts_itemGifts[] | null;
}
