import gql from "graphql-tag";
import { EditUserInput } from "./__generated__/globalTypes";

export default {
  mutation: gql`
    mutation UpdateUser($id: Int!, $data: EditUserInput!) {
      updateUser(id: $id, data: $data) {
        id
      }
    }
  `,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMutation = (id: number, data: EditUserInput): any => ({
  mutation: gql`mutation UpdateUser($id: Int!, $data: EditUserInput!) {
    updateUser(id: $id, data: $data) {
      id${Object.keys(data).map((key): string => `\n    ${key}`)}
    }
  }`,
  variables: { id, data },
});
