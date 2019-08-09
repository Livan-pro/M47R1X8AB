import gql from "graphql-tag";

export default {
  query: gql`
    query CharacterById($id: Int!) {
      character(id: $id) {
        id
        name
        own
        avatarUploadedAt
      }
    }
  `,
};
