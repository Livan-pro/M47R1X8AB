import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import NewsQuery from "./News";
import { News } from "./__generated__/News";
import { NewsInput } from "./__generated__/globalTypes";
import { FetchResult } from "apollo-link";
import { UpdateNews } from "./__generated__/UpdateNews";

export default {
  mutation: gql`
    mutation UpdateNews($id: Int!, $data: NewsInput!) {
      updateNews(id: $id, data: $data) {
        id
        title
        datetime
        text
        attachment {
          id
          name
          type
        }
      }
    }
  `,
  update: (proxy: DataProxy, response?: FetchResult<UpdateNews>): void => {
    const data = proxy.readQuery<News>(NewsQuery);
    const idx = data.news.findIndex((item): boolean => item.id === response.data.updateNews.id);
    if (idx < 0) data.news.push(response.data.updateNews);
    else data.news[idx] = response.data.updateNews;
    proxy.writeQuery({ ...NewsQuery, data });
  },
};

export const createUpdate = (id: number, input: NewsInput): ((proxy: DataProxy) => void) => {
  return (proxy: DataProxy): void => {
    const data = proxy.readQuery<News>(NewsQuery);
    const idx = data.news.findIndex((item): boolean => item.id == id);
    if (idx === -1) return;
    for (const key of Object.keys(input)) {
      data.news[idx][key] = input[key];
    }
    proxy.writeQuery({ ...NewsQuery, data });
  };
};
