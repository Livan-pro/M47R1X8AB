import gql from "graphql-tag";

export default {
  query: gql`
    query ImplantProlongations {
      implantProlongations: listImplantProlongation {
        id
        createdAt
        code
        usedBy {
          id
          name
          avatarUploadedAt
        }
        usedAt
        time
      }
    }
  `,
};
