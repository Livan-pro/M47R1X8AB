import gql from "graphql-tag";

export default {
  query: gql`
    query Users {
      users {
        id
        email
        firstName
        lastName
        phone
        vkId
        medicalInfo
        roles
        createdAt
        mainCharacter {
          id
          name
          quenta
          avatarUploadedAt
          roles
        }
      }
    }
  `,
};
