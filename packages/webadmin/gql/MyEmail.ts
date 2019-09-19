import gql from "graphql-tag";

const obj = ({
  query: gql`
    query MyEmail {
      me {
        email
      }
    }
  `,
  error: (): void => {},
  errorPolicy: "ignore",
  fetchPolicy: "cache-and-network",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown) as { query: any };
export default obj;
