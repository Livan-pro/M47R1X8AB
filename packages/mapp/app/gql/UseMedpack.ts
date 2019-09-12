import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation UseMedpack($code: String!) {
      useMedpack(code: $code)
    }
  `,
};
