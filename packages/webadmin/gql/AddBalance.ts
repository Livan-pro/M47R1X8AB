import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation AddBalance($id: Int!, $amount: Int!) {
      addBalance(id: $id, amount: $amount) {
        id
        balance
      }
    }
  `,
};
