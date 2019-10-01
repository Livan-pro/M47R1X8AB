import gql from "graphql-tag";

export default {
  query: gql`
    query BalanceHistory {
      allBalanceHistory {
        id
        createdAt
        from {
          id
          name
          avatarUploadedAt
        }
        to {
          id
          name
          avatarUploadedAt
        }
        amount
      }
    }
  `,
};
