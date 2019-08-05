/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: News
// ====================================================

export interface News_news {
  __typename: "News";
  id: number;
  title: string;
  text: string;
  datetime: any;
}

export interface News {
  news: News_news[];
}
