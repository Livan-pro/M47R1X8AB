import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import ImplantProlongationQuery from "./ImplantProlongations";
import { ImplantProlongations } from "./__generated__/ImplantProlongations";
import { FetchResult } from "apollo-link";
import { CreateImplantProlongation } from "./__generated__/CreateImplantProlongation";

export default {
  mutation: gql`
    mutation CreateImplantProlongation($code: String!, $time: Int!) {
      createImplantProlongation(code: $code, time: $time) {
        id
        createdAt
        code
        usedBy {
          id
          name
          avatarUploadedAt
        }
        usedAt
        time
      }
    }
  `,
  update: (proxy: DataProxy, response?: FetchResult<CreateImplantProlongation>): void => {
    const data = proxy.readQuery<ImplantProlongations>(ImplantProlongationQuery);
    data.implantProlongations.push(response.data.createImplantProlongation);
    proxy.writeQuery({ ...ImplantProlongationQuery, data });
  },
};
