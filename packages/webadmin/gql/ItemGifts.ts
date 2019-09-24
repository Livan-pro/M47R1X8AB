import gql from "graphql-tag";

export default {
  query: gql`
    query ItemGifts {
      itemGifts: listItemGift {
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
};
