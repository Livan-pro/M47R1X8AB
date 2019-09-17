import gql from "graphql-tag";
import { MainCharacter } from "./__generated__/MainCharacter";

export default {
  query: gql`
    query MainCharacter {
      me {
        mainCharacter {
          id
          name
          avatarUploadedAt
          balance
          profession
          professionLevel
          state
          pollution
          deathTime
        }
      }
    }
  `,
  subscribeToMore: {
    document: gql`
      subscription MainCharacterSubscription {
        mainCharacter {
          id
          name
          avatarUploadedAt
          balance
          profession
          professionLevel
          state
          pollution
          deathTime
          implantsRejectTime
        }
      }
    `,
    updateQuery: (
      prev: MainCharacter,
      { subscriptionData }: { subscriptionData: { data: { mainCharacter: Partial<MainCharacter> } } },
    ): MainCharacter => {
      const obj = {};
      for (const key in subscriptionData.data.mainCharacter) {
        if (subscriptionData.data.mainCharacter[key] !== null) obj[key] = subscriptionData.data.mainCharacter[key];
      }
      const data = {
        me: {
          __typename: "User",
          mainCharacter: { ...prev.me.mainCharacter, ...obj },
        },
      };
      return data as MainCharacter;
    },
  },
};
