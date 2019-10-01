import gql from "graphql-tag";

export default {
  query: gql`
    query Locations {
      locations {
        id
        name
      }
    }
  `,
};
