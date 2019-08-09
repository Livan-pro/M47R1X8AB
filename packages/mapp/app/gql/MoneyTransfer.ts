import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import MyBalance from "./MyBalance";
import { MyBalance as MyBalanceType } from "./__generated__/MyBalance";

export default {
  mutation: gql`
    mutation MoneyTransfer($id: Int!, $amount: Int!) {
      moneyTransfer(id: $id, amount: $amount)
    }
  `,
};

export const createUpdate = (amount: number): ((proxy: DataProxy) => void) => {
  return (proxy: DataProxy): void => {
    const data = proxy.readQuery<MyBalanceType>({ query: MyBalance.query });
    if (!data) return;
    const balance = data.me.mainCharacter.balance - amount;
    proxy.writeQuery({
      query: MyBalance.query,
      data: {
        me: {
          __typename: "User",
          mainCharacter: {
            __typename: "Character",
            balance,
          },
        },
      },
    });
  };
};
