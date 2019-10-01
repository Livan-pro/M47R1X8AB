import gql from "graphql-tag";

export default {
  query: gql`
    query CharacterInfoById($id: Int!) {
      character(id: $id) {
        id
        name
        own
        avatarUploadedAt
        profession
        professionLevel
      }
    }
  `,
};
