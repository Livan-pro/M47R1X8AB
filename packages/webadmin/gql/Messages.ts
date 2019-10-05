import gql from "graphql-tag";
import { Messages_messages as Message, Messages as MessagesQuery } from "./__generated__/Messages";
import { Messages as MessagesSubscription } from "./__generated__/MessagesSubscription";

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
  /*subscribeToMore: {
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
      prev: MessagesQuery,
      {
        subscriptionData: {
          data: { messages: message },
        },
      }: { subscriptionData: { data: { messages: Message } } },
    ): MessagesSubscription => {
      const idx = prev.messages.findIndex((msg): boolean => msg.id === message.id);
      if (idx < 0) prev.messages.push(message);
      return prev;
    },
  },*/
};
