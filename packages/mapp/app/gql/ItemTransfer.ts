import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import { Inventory as InventoryType } from "./__generated__/Inventory";
import Inventory from "./Inventory";

export default {
  mutation: gql`
    mutation ItemTransfer($characterId: Int!, $itemId: Int!, $amount: Int!) {
      transferItem(to: $characterId, itemId: $itemId, amount: $amount)
    }
  `,
};

export const createUpdate = (itemId: number, amount: number): ((proxy: DataProxy) => void) => {
  return (proxy: DataProxy): void => {
    const data = proxy.readQuery<InventoryType>({ query: Inventory.query });
    if (!data) return;
    const idx = data.inventory.findIndex((val): boolean => val.itemId === itemId);
    if (idx < 0) return;
    data.inventory[idx].amount -= amount;
    proxy.writeQuery<InventoryType>({
      query: Inventory.query,
      data: {
        inventory: data.inventory,
      },
    });
  };
};
