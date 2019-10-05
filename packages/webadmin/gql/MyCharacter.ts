import gql from "graphql-tag";

const obj = ({
  query: gql`
    query MyCharacter {
      me {
        mainCharacter {
          id
          name
          avatarUploadedAt
        }
      }
    }
  `,
  fetchPolicy: "cache-and-network",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown) as { query: any };

export default obj;
