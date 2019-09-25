import gql from "graphql-tag";
import { LocationInput } from "./__generated__/globalTypes";

export default {
  mutation: gql`
    mutation UpdateLocation($id: Int!, $data: LocationInput!) {
      updateLocation(id: $id, data: $data) {
        id
      }
    }
  `,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMutation = (id: number, data: LocationInput): any => ({
  mutation: gql`mutation UpdateLocation($id: Int!, $data: LocationInput!) {
    updateLocation(id: $id, data: $data) {
      id${Object.keys(data).map((key): string => `\n    ${key}`)}
    }
  }`,
  variables: { id, data },
});
