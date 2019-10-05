import gql from "graphql-tag";

export default {
  query: gql`
    query CharactersInfo {
      characters {
        id
        name
        avatarUploadedAt
      }
    }
  `,
};
