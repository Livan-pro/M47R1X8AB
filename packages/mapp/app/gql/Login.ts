import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import { FetchResult } from "apollo-link";
import MyEmail from "./MyEmail";

export default {
  mutation: gql`
    mutation Login($email: String!, $password: String!, $rememberMe: Boolean) {
      login(email: $email, password: $password, rememberMe: $rememberMe) {
        email
        token
      }
    }
  `,
  update: (proxy: DataProxy, res: FetchResult<{ login: { email: string } }>): void => {
    if (!res.data) return;
    proxy.writeQuery({
      query: MyEmail.query,
      data: {
        me: {
          __typename: "User",
          email: res.data.login.email,
        },
      },
    });
  },
};
