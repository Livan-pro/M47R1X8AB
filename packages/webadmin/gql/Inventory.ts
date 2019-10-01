import gql from "graphql-tag";

export default {
  query: gql`
    query Inventory($id: Int!) {
      inventory(id: $id) {
        itemId
        amount
      }
    }
  `,
};
