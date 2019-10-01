import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation ProlongImplants($code: String!) {
      prolongImplants(code: $code)
    }
  `,
};
