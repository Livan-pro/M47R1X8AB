import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import MedpackQuery from "./Medpacks";
import { Medpacks } from "./__generated__/Medpacks";
import { FetchResult } from "apollo-link";
import { CreateMedpack } from "./__generated__/CreateMedpack";

export default {
  mutation: gql`
    mutation CreateMedpack($code: String!) {
      createMedpack(code: $code) {
        id
        createdAt
        code
        usedBy {
          id
          name
          avatarUploadedAt
        }
        usedAt
      }
    }
  `,
  update: (proxy: DataProxy, response?: FetchResult<CreateMedpack>): void => {
    const data = proxy.readQuery<Medpacks>(MedpackQuery);
    data.medpacks.push(response.data.createMedpack);
    proxy.writeQuery({ ...MedpackQuery, data });
  },
};
