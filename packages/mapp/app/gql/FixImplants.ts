import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation FixImplants($id: Int!) {
      fixImplants(characterId: $id) {
        id
        implantsRejectTime
      }
    }
  `,
};
