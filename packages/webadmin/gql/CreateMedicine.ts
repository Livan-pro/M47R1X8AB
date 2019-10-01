import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import MedicineQuery from "./Medicines";
import { Medicines } from "./__generated__/Medicines";
import { FetchResult } from "apollo-link";
import { CreateMedicine } from "./__generated__/CreateMedicine";

export default {
  mutation: gql`
    mutation CreateMedicine($code: String!) {
      createMedicine(code: $code) {
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
  update: (proxy: DataProxy, response?: FetchResult<CreateMedicine>): void => {
    const data = proxy.readQuery<Medicines>(MedicineQuery);
    data.medicines.push(response.data.createMedicine);
    proxy.writeQuery({ ...MedicineQuery, data });
  },
};
