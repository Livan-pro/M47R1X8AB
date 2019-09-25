import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation SetLocation($id: Int!, $locationId: Int!) {
      updateCharacter(id: $id, data: { locationId: $locationId }) {
        id
        location {
          id
          name
        }
      }
    }
  `,
};
