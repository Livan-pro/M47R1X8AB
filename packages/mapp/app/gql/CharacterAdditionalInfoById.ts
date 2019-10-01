import gql from "graphql-tag";

export default {
  query: gql`
    query CharacterAdditionalInfoById($id: Int!) {
      addinfo: character(id: $id) {
        id
        state
        location {
          name
        }
        properties {
          name
          value
        }
      }
    }
  `,
};
