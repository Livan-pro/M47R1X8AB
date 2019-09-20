import gql from "graphql-tag";
import { FullCharacterInput } from "./__generated__/globalTypes";

export default {
  mutation: gql`
    mutation UpdateCharacter($id: Int!, $data: FullCharacterInput!) {
      updateCharacter(id: $id, data: $data) {
        id
      }
    }
  `,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMutation = (id: number, data: FullCharacterInput): any => ({
  mutation: gql`mutation UpdateCharacter($id: Int!, $data: FullCharacterInput!) {
    updateCharacter(id: $id, data: $data) {
      id${Object.keys(data).map((key): string => `\n    ${key}`)}
    }
  }`,
  variables: { id, data },
});
