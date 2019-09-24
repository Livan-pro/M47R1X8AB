/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateItemGift
// ====================================================

export interface CreateItemGift_createItemGift_usedBy {
  __typename: "Character";
  id: number;
  name: string;
  avatarUploadedAt: any | null;
}

export interface CreateItemGift_createItemGift {
  __typename: "ItemGift";
  id: number;
  createdAt: any;
  code: string;
  usedBy: CreateItemGift_createItemGift_usedBy | null;
  usedAt: any | null;
  itemId: number;
  amount: number;
}

export interface CreateItemGift {
  createItemGift: CreateItemGift_createItemGift;
}

export interface CreateItemGiftVariables {
  code: string;
  itemId: number;
  amount: number;
}
