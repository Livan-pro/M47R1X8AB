/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Messages
// ====================================================

export interface Messages_messages {
  __typename: "Message";
  id: number;
  createdAt: any;
  fromId: number;
  toId: number;
  text: string;
}

export interface Messages {
  messages: Messages_messages[] | null;
}

export interface MessagesVariables {
  id: number;
}
