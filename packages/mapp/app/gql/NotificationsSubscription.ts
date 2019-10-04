import gql from "graphql-tag";

export default {
  query: gql`
    subscription NotificationsSubscription {
      title
      body
      data
    }
  `,
};
