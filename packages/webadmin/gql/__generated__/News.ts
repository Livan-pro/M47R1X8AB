/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { AttachmentType } from "./globalTypes";

// ====================================================
// GraphQL query operation: News
// ====================================================

export interface News_news_attachment {
  __typename: "Attachment";
  id: string;
  name: string;
  type: AttachmentType;
}

export interface News_news {
  __typename: "News";
  id: number;
  title: string;
  text: string;
  datetime: any;
  attachment: News_news_attachment | null;
}

export interface News {
  news: News_news[];
}
