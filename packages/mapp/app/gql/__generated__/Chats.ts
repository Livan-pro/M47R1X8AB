/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Chats
// ====================================================

export interface Chats_chats_participants {
  __typename: "Character";
  id: number;
  name: string;
  own: boolean;
  avatarUploadedAt: any | null;
}

export interface Chats_chats_lastMessage {
  __typename: "Message";
  id: number;
  createdAt: any;
  fromId: number;
  toId: number;
  text: string;
}

export interface Chats_chats {
  __typename: "Chat";
  id: number;
  participants: Chats_chats_participants[];
  lastMessage: Chats_chats_lastMessage | null;
}

export interface Chats {
  chats: Chats_chats[];
}
