import gql from "graphql-tag";

export default {
  mutation: gql`
    mutation Heal($id: Int!) {
      heal(characterId: $id) {
        id
        state
      }
    }
  `,
};
