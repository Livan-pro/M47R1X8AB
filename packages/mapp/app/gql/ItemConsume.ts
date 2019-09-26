import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import { Inventory as InventoryType } from "./__generated__/Inventory";
import Inventory from "./Inventory";
import { FetchResult } from "apollo-link";
import { ItemConsume } from "./__generated__/ItemConsume";

export default {
  mutation: gql`
    mutation ItemConsume($itemId: Int!, $amount: Int!) {
      consumeItem(itemId: $itemId, amount: $amount) {
        itemId
        amount
      }
    }
  `,
  update: (proxy: DataProxy, res: FetchResult<ItemConsume>): void => {
    const data = proxy.readQuery<InventoryType>({ query: Inventory.query });
    if (!data) return;
    const idx = data.inventory.findIndex((val): boolean => val.itemId === res.data.consumeItem.itemId);
    if (idx < 0) data.inventory.push(res.data.consumeItem);
    else data.inventory[idx].amount = res.data.consumeItem.amount;
    proxy.writeQuery<InventoryType>({
      query: Inventory.query,
      data: {
        inventory: data.inventory,
      },
    });
  },
};
