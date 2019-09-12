import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation UseMedicine($code: String!) {
      useMedicine(code: $code)
    }
  `,
};
