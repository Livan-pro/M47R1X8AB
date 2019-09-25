import gql from "graphql-tag";

export default {
  query: gql`
    query Medicines {
      medicines: listMedicine {
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
