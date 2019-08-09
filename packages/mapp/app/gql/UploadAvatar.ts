import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import { FetchResult } from "apollo-link";
import { UploadAvatar } from "./__generated__/UploadAvatar";

export default {
  mutation: gql`
    mutation UploadAvatar($id: Int!, $avatar: String!) {
      uploadAvatar(id: $id, avatar: $avatar)
    }
  `,
};

export const createUpdate = (id: number): ((proxy: DataProxy, res: FetchResult<UploadAvatar>) => void) => {
  return (proxy: DataProxy, res: FetchResult<UploadAvatar>): void => {
    proxy.writeFragment({
      id: `Character:${id}`,
      fragment: gql`
        fragment avatar on Character {
          avatarUploadedAt
        }
      `,
      data: {
        __typename: "Character",
        avatarUploadedAt: res.data.uploadAvatar,
      },
    });
  };
};
