import gql from "graphql-tag";

export default {
  query: gql`
    query Inventory {
      inventory {
        itemId
        amount
      }
    }
  `,
};
