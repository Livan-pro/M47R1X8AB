import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import { FetchResult } from "apollo-link";
import { SetMainCharacter } from "./__generated__/SetMainCharacter";
import MainCharacter from "./MainCharacter";

export default {
  mutation: gql`
    mutation SetMainCharacter($id: Int!) {
      setMainCharacter(characterId: $id) {
        id
        name
        avatarUploadedAt
        balance
      }
    }
  `,
  update: (proxy: DataProxy, res: FetchResult<SetMainCharacter>): void => {
    if (!res.data) return;
    proxy.writeQuery({
      query: MainCharacter.query,
      data: {
        me: {
          __typename: "User",
          mainCharacter: res.data.setMainCharacter,
        },
      },
    });
  },
};
