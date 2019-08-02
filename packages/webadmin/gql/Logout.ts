import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import MyEmail from "./MyEmail";

export default {
  mutation: gql`
    mutation Logout {
      logout
    }
  `,
  update: (proxy: DataProxy): void => {
    proxy.writeQuery({
      query: MyEmail.query,
      data: {
        me: null,
      },
    });
  },
};
