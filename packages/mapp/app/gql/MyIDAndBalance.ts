import gql from "graphql-tag";

export default {
  query: gql`
    query MyIDAndBalance {
      me {
        mainCharacter {
          id
          balance
        }
      }
    }
  `,
};
