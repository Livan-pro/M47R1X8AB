import gql from "graphql-tag";

export default {
  query: gql`
    query Medpacks {
      medpacks: listMedpack {
        id
        createdAt
        code
        usedBy {
          id
          name
          avatarUploadedAt
        }
        usedAt
      }
    }
  `,
};
