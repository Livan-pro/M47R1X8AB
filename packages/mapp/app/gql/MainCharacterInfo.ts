import gql from "graphql-tag";

export default {
  query: gql`
    query MainCharacterInfo {
      me {
        mainCharacter {
          id
          name
          avatarUploadedAt
          own
        }
      }
    }
  `,
};
