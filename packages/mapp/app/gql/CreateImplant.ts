import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation CreateImplant($data: FullImplantInput!) {
      createImplant(data: $data) {
        id
      }
    }
  `,
};
