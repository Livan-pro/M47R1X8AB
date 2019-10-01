import gql from "graphql-tag";

export default {
  query: gql`
    query CharacterAdditionalInfoById($id: Int!) {
      addinfo: character(id: $id) {
        id
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
