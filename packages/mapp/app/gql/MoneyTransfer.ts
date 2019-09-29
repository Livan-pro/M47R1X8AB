import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation MoneyTransfer($id: Int!, $amount: Int!) {
      moneyTransfer(id: $id, amount: $amount) {
        id
        balance
      }
    }
  `,
};
