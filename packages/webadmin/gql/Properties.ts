import gql from "graphql-tag";

export default {
  query: gql`
    query Properties($id: Int!) {
      character(id: $id) {
        id
        properties {
          name
          value
        }
      }
    }
  `,
};
