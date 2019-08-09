import gql from "graphql-tag";

export default {
  query: gql`
    query Characters {
      characters {
        id
        name
        own
        avatarUploadedAt
      }
    }
  `,
};
