/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: MessagesSubscription
// ====================================================

export interface MessagesSubscription_messages {
  __typename: "Message";
  id: number;
  createdAt: any;
  fromId: number;
  toId: number;
  text: string;
}

export interface MessagesSubscription {
  messages: MessagesSubscription_messages;
}

export interface MessagesSubscriptionVariables {
  id: number;
}
