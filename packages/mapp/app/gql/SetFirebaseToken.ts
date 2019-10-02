import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation SetFirebaseToken($token: String!) {
      setFirebaseToken(token: $token)
    }
  `,
};
