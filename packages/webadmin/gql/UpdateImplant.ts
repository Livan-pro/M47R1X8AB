import gql from "graphql-tag";
import { FullImplantInput } from "./__generated__/globalTypes";
import { DataProxy } from "apollo-cache";
import { FetchResult } from "apollo-link";
import ImplantsQuery from "./Implants";
import { Implants } from "./__generated__/Implants";
import { UpdateImplant } from "./__generated__/UpdateImplant";

export default {
  mutation: gql`
    mutation UpdateImplant($id: Int!, $data: FullImplantInput!) {
      updateImplant(id: $id, data: $data) {
        id
        name
        type
        working
        quality
      }
    }
  `,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMutation = (id: number, data: FullImplantInput, currentCharacterId?: number): any => {
  const hasCharacterId = Object.hasOwnProperty.call(data, "characterId");
  const newCharacterId = data.characterId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutation: { mutation: any; variables: any; update?: any } = {
    mutation: gql`mutation UpdateImplant($id: Int!, $data: FullImplantInput!) {
      updateImplant(id: $id, data: $data) {
        id${Object.keys(data)
          .filter((key): boolean => key !== "characterId")
          .map((key): string => `\n    ${key}`)}
      }
    }`,
    variables: { id, data },
  };
  if (hasCharacterId) {
    mutation.update = (proxy: DataProxy, response?: FetchResult<UpdateImplant>): void => {
      if (currentCharacterId > -1) {
        const query = { ...ImplantsQuery, variables: { id: currentCharacterId } };
        const data = proxy.readQuery<Implants>(query);
        const idx = data.implants.findIndex((implant): boolean => implant.id === id);
        if (id > -1) {
          data.implants.splice(idx, 1);
          proxy.writeQuery({ ...query, data });
        }
      }

      const query = { ...ImplantsQuery, variables: { id: newCharacterId } };
      const data = proxy.readQuery<Implants>(query);
      data.implants.push(response.data.updateImplant);
      proxy.writeQuery({ ...query, data });
    };
  }
  return mutation;
};
