import gql from "graphql-tag";

export default {
  query: gql`
    query MainCharacterInfoWithRoles {
      me {
        roles
        mainCharacter {
          id
          name
          avatarUploadedAt
          own
          roles
          profession
        }
      }
    }
  `,
};
