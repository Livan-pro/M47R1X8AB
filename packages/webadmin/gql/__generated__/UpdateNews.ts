/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { NewsInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateNews
// ====================================================

export interface UpdateNews {
  updateNews: boolean | null;
}

export interface UpdateNewsVariables {
  id: number;
  data: NewsInput;
}
