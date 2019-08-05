import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import NewsQuery from "./News";
import { News } from "./__generated__/News";
import { FetchResult } from "apollo-link";
import { CreateNews } from "./__generated__/CreateNews";

export default {
  mutation: gql`
    mutation CreateNews($data: NewsInput!) {
      createNews(data: $data) {
        id
        title
        datetime
        text
      }
    }
  `,
  update: (proxy: DataProxy, response?: FetchResult<CreateNews>): void => {
    const data = proxy.readQuery<News>(NewsQuery);
    data.news.push(response.data.createNews);
    proxy.writeQuery({ ...NewsQuery, data });
  },
};
