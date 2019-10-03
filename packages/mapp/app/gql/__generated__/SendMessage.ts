/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { MessageInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SendMessage
// ====================================================

export interface SendMessage_sendMessage {
  __typename: "Message";
  id: number;
}

export interface SendMessage {
  sendMessage: SendMessage_sendMessage;
}

export interface SendMessageVariables {
  id: number;
  message: MessageInput;
}
