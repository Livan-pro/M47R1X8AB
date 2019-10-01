import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import { CharacterState } from "./__generated__/globalTypes";

export default {
  mutation: gql`
    mutation Suicide {
      suicide
    }
  `,
};

export const createUpdate = (id: number): ((proxy: DataProxy) => void) => {
  return (proxy: DataProxy): void => {
    proxy.writeFragment({
      id: `Character:${id}`,
      fragment: gql`
        fragment state on Character {
          state
        }
      `,
      data: {
        __typename: "Character",
        state: CharacterState.Death,
      },
    });
  };
};
