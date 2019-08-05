/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { NewsInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateNews
// ====================================================

export interface CreateNews_createNews {
  __typename: "News";
  id: number;
  title: string;
  datetime: any;
  text: string;
}

export interface CreateNews {
  createNews: CreateNews_createNews;
}

export interface CreateNewsVariables {
  data: NewsInput;
}
