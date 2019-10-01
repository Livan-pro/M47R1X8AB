import gql from "graphql-tag";

export default {
  query: gql`
    query MedicalInfoById($id: Int!) {
      character(id: $id) {
        id
        name
        own
        avatarUploadedAt
        profession
        professionLevel
        state
        pollution
        implantsRejectTime
      }
    }
  `,
};
