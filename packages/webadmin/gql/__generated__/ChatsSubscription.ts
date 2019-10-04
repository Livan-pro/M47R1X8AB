/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: ChatsSubscription
// ====================================================

export interface ChatsSubscription_chats_participants {
  __typename: "Character";
  id: number;
  name: string;
  own: boolean;
  avatarUploadedAt: any | null;
}

export interface ChatsSubscription_chats_lastMessage {
  __typename: "Message";
  id: number;
  createdAt: any;
  fromId: number;
  toId: number;
  text: string;
}

export interface ChatsSubscription_chats {
  __typename: "ChatUpdate";
  id: number;
  participants: ChatsSubscription_chats_participants[] | null;
  lastMessage: ChatsSubscription_chats_lastMessage | null;
}

export interface ChatsSubscription {
  chats: ChatsSubscription_chats;
}
