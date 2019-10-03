import gql from "graphql-tag";
import { Chats, Chats_chats as Chat } from "./__generated__/Chats";

export default {
  query: gql`
    query Chats {
      chats {
        id
        participants {
          id
          name
          own
          avatarUploadedAt
        }
        lastMessage {
          id
          createdAt
          fromId
          toId
          text
        }
      }
    }
  `,
  subscribeToMore: {
    document: gql`
      subscription ChatsSubscription {
        chats {
          id
          participants {
            id
            name
            own
            avatarUploadedAt
          }
          lastMessage {
            id
            createdAt
            fromId
            toId
            text
          }
        }
      }
    `,
    updateQuery: (
      prev: Chats,
      {
        subscriptionData: {
          data: { chats: chat },
        },
      }: { subscriptionData: { data: { chats: Chat } } },
    ): Chats => {
      const idx = prev.chats.findIndex((c): boolean => c.id === chat.id);
      if (idx < 0) prev.chats.push(chat);
      else {
        if (chat.participants) prev.chats[idx].participants = chat.participants;
        prev.chats[idx].lastMessage = chat.lastMessage;
      }
      return prev;
    },
  },
};
