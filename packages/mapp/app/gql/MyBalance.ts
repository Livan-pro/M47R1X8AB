import gql from "graphql-tag";

export default {
  query: gql`
    query MyBalance {
      me {
        mainCharacter {
          balance
        }
      }
    }
  `,
  fetchPolicy: "cache-and-network",
};
