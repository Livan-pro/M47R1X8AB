/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { NewsInput, AttachmentType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateNews
// ====================================================

export interface UpdateNews_updateNews_attachment {
  __typename: "Attachment";
  id: string;
  name: string;
  type: AttachmentType;
}

export interface UpdateNews_updateNews {
  __typename: "News";
  id: number;
  title: string;
  datetime: any;
  text: string;
  attachment: UpdateNews_updateNews_attachment | null;
}

export interface UpdateNews {
  updateNews: UpdateNews_updateNews;
}

export interface UpdateNewsVariables {
  id: number;
  data: NewsInput;
}
