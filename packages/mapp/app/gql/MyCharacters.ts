import gql from "graphql-tag";

export default {
  query: gql`
    query MyCharacters {
      me {
        characters {
          id
          name
          own
          avatarUploadedAt
          balance
        }
      }
    }
  `,
};
