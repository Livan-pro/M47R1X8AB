import gql from "graphql-tag";

export default {
  query: gql`
    query MyState {
      me {
        mainCharacter {
          state
        }
      }
    }
  `,
};
