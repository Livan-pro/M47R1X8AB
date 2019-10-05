import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation SendMessage($id: Int!, $message: MessageInput!) {
      sendMessage(chatId: $id, message: $message) {
        id
      }
    }
  `,
};
