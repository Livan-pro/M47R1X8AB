import gql from "graphql-tag";

export default {
  query: gql`
    query MedicalInfoById($id: Int!) {
      medicalInfo: character(id: $id) {
        id
        state
        pollution
        implantsRejectTime
      }
    }
  `,
};
