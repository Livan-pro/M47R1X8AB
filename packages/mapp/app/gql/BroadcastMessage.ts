import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation BroadcastMessage($text: String!) {
      broadcastMessage(text: $text)
    }
  `,
};
