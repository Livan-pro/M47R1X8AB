import gql from "graphql-tag";

export default {
  query: gql`
    query News {
      news {
        id
        title
        text
        datetime
        attachment {
          id
          name
          type
        }
      }
    }
  `,
};
