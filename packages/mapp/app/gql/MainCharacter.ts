import gql from "graphql-tag";

export default {
  query: gql`
    query MainCharacter {
      me {
        mainCharacter {
          id
          name
          avatarUploadedAt
          balance
        }
      }
    }
  `,
};
