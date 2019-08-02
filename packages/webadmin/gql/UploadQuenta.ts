import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import { FetchResult } from "apollo-link";

export default {
  mutation: gql`
    mutation UploadQuenta($id: Int!, $file: Upload) {
      editCharacter(id: $id, character: { quenta: $file })
    }
  `,
};

export const createUpdate = (id: number, file: File): ((proxy: DataProxy, res: FetchResult<boolean>) => void) => {
  return (proxy: DataProxy): void => {
    proxy.writeFragment({
      id: `Character:${id}`,
      fragment: gql`
        fragment quenta on Character {
          quenta
        }
      `,
      data: {
        __typename: "Character",
        quenta: file.name,
      },
    });
  };
};
