import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import ItemGiftQuery from "./ItemGifts";
import { ItemGifts } from "./__generated__/ItemGifts";
import { FetchResult } from "apollo-link";
import { CreateItemGift } from "./__generated__/CreateItemGift";

export default {
  mutation: gql`
    mutation CreateItemGift($code: String!, $itemId: Int!, $amount: Int!) {
      createItemGift(code: $code, itemId: $itemId, amount: $amount) {
        id
        createdAt
        code
        usedBy {
          id
          name
          avatarUploadedAt
        }
        usedAt
        itemId
        amount
      }
    }
  `,
  update: (proxy: DataProxy, response?: FetchResult<CreateItemGift>): void => {
    const data = proxy.readQuery<ItemGifts>(ItemGiftQuery);
    data.itemGifts.push(response.data.createItemGift);
    proxy.writeQuery({ ...ItemGiftQuery, data });
  },
};
