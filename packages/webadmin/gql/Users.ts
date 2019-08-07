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
        city
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
