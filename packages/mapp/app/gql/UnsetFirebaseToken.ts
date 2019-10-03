import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation UnsetFirebaseToken($token: String!) {
      unsetFirebaseToken(token: $token)
    }
  `,
};
