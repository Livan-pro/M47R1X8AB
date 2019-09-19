import gql from "graphql-tag";

const obj = {
  query: gql`
    query ImplantsRejectTime {
      me {
        mainCharacter {
          implantsRejectTime
        }
      }
    }
  `,
  fetchPolicy: "cache-only",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default obj as { query: any };