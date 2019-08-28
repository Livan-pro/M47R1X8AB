import gql from "graphql-tag";

export default {
  query: gql`
    query MyEmail {
      me {
        email
      }
    }
  `,
  error: (): void => {},
  errorPolicy: "ignore",
};
