import gql from "graphql-tag";

export default {
  query: gql`
    query Implants($id: Int!) {
      implants(id: $id) {
        id
        name
        type
        working
        quality
      }
    }
  `,
};
