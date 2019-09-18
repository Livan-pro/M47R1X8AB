import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation UseItemGift($code: String!) {
      useItemGift(code: $code) {
        itemId
        amount
      }
    }
  `,
};
