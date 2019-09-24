import gql from "graphql-tag";
import InventoryQuery from "./Inventory";
import { Inventory } from "./__generated__/Inventory";
import { AddItems } from "./__generated__/AddItems";
import { DataProxy } from "apollo-cache";
import { FetchResult } from "apollo-link";

export default {
  mutation: gql`
    mutation AddItems($characterId: Int!, $itemId: Int!, $amount: Int!) {
      addItems(characterId: $characterId, itemId: $itemId, amount: $amount) {
        itemId
        amount
      }
    }
  `,
};

export const createUpdate = (characterId: number): ((proxy: DataProxy, res: FetchResult<AddItems>) => void) => {
  return (proxy: DataProxy, result: FetchResult<AddItems>): void => {
    const query = { ...InventoryQuery, variables: { id: characterId } };
    const data = proxy.readQuery<Inventory>(query);
    const idx = data.inventory.findIndex((item): boolean => item.itemId === result.data.addItems.itemId);
    if (idx < 0) data.inventory.push(result.data.addItems);
    else data.inventory[idx] = result.data.addItems;
    data.inventory = [...data.inventory];
    proxy.writeQuery({ ...query, data });
  };
};
