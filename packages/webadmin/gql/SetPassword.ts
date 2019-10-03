import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation SetPassword($id: Int!, $password: String!) {
      setPassword(id: $id, password: $password)
    }
  `,
};
