import gql from "graphql-tag";

export default {
  query: gql`
    query Chat($id: Int!) {
      chat(id: $id) {
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
};
