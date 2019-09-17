import gql from "graphql-tag";

export default {
  query: gql`
    query Implants {
      implants {
        id
        name
        type
        working
        quality
      }
    }
  `,
};
