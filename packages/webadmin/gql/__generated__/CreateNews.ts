/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { NewsInput, AttachmentType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateNews
// ====================================================

export interface CreateNews_createNews_attachment {
  __typename: "Attachment";
  id: string;
  name: string;
  type: AttachmentType;
}

export interface CreateNews_createNews {
  __typename: "News";
  id: number;
  title: string;
  datetime: any;
  text: string;
  attachment: CreateNews_createNews_attachment | null;
}

export interface CreateNews {
  createNews: CreateNews_createNews;
}

export interface CreateNewsVariables {
  data: NewsInput;
}
