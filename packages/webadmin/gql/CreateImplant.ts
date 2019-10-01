import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import ImplantQuery from "./Implants";
import { Implants } from "./__generated__/Implants";
import { FetchResult } from "apollo-link";
import { CreateImplant } from "./__generated__/CreateImplant";

export default {
  mutation: gql`
    mutation CreateImplant($data: FullImplantInput!) {
      createImplant(data: $data) {
        id
        name
        type
        working
        quality
      }
    }
  `,
};

export const createUpdate = (id: number): ((proxy: DataProxy, response?: FetchResult<CreateImplant>) => void) => (
  proxy: DataProxy,
  response?: FetchResult<CreateImplant>,
): void => {
  const data = proxy.readQuery<Implants>({ ...ImplantQuery, variables: { id } });
  data.implants.push(response.data.createImplant);
  proxy.writeQuery({ ...ImplantQuery, data });
};
