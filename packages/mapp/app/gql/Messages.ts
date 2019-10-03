import gql from "graphql-tag";
import { Messages_messages as Message, Messages } from "./__generated__/Messages";

export default {
  query: gql`
    query Messages($id: Int!) {
      messages(chatId: $id) {
        id
        createdAt
        fromId
        toId
        text
      }
    }
  `,
  subscribeToMore: {
    document: gql`
      subscription MessagesSubscription($id: Int!) {
        messages(chatId: $id) {
          id
          createdAt
          fromId
          toId
          text
        }
      }
    `,
    updateQuery: (
      prev: Messages,
      {
        subscriptionData: {
          data: { messages: message },
        },
      }: { subscriptionData: { data: { messages: Message } } },
    ): Messages => {
      const idx = prev.messages.findIndex((msg): boolean => msg.id === message.id);
      if (idx < 0) prev.messages.push(message);
      return prev;
    },
  },
};
