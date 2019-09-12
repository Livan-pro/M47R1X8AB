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
        }
      }
    `,
    updateQuery: (
      prev: MainCharacter,
      { subscriptionData }: { subscriptionData: { data: { mainCharacter: Partial<MainCharacter> } } },
    ): MainCharacter => {
      const obj = {};
      console.log("updateQuery1", subscriptionData.data.mainCharacter);
      for (const key in subscriptionData.data.mainCharacter) {
        if (subscriptionData.data.mainCharacter[key] !== null) obj[key] = subscriptionData.data.mainCharacter[key];
      }
      console.log("updateQuery", obj);
      console.log("prev", { ...prev });
      const data = {
        me: {
          __typename: "User",
          mainCharacter: { ...prev.me.mainCharacter, ...obj },
        },
      };
      console.log("updated", data);
      return data as MainCharacter;
    },
  },
};
