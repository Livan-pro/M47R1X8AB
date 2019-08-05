import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import NewsQuery from "./News";
import { News } from "./__generated__/News";

export default {
  mutation: gql`
    mutation DeleteNews($ids: [Int!]!) {
      deleteNews(ids: $ids)
    }
  `,
};

export const createUpdate = (ids: number[]): ((proxy: DataProxy) => void) => {
  return (proxy: DataProxy): void => {
    const data = proxy.readQuery<News>(NewsQuery);
    for (const id of ids) {
      const idx = data.news.findIndex((item): boolean => item.id == id);
      if (idx === -1) continue;
      data.news.splice(idx, 1);
    }
    proxy.writeQuery({ ...NewsQuery, data });
  };
};
