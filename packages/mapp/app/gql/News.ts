import gql from "graphql-tag";

export default {
  query: gql`
    query News {
      news {
        title
        datetime
        text
        attachment {
          id
          name
          type
        }
      }
    }
  `,
};
