import gql from "graphql-tag";

export default {
  query: gql`
    subscription NotificationsSubscription {
      notifications {
        title
        body
        data
      }
    }
  `,
};
