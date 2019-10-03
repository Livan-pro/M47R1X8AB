/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Chat
// ====================================================

export interface Chat_chat_participants {
  __typename: "Character";
  id: number;
  name: string;
  own: boolean;
  avatarUploadedAt: any | null;
}

export interface Chat_chat_lastMessage {
  __typename: "Message";
  id: number;
  createdAt: any;
  fromId: number;
  toId: number;
  text: string;
}

export interface Chat_chat {
  __typename: "Chat";
  id: number;
  participants: Chat_chat_participants[];
  lastMessage: Chat_chat_lastMessage | null;
}

export interface Chat {
  chat: Chat_chat | null;
}

export interface ChatVariables {
  id: number;
}
