import gql from "graphql-tag";

export default {
  query: gql`
    query MyStateExtended {
      me {
        mainCharacter {
          id
          name
          avatarUploadedAt
          profession
          professionLevel
          state
          pollution
          deathTime
        }
      }
    }
  `,
};
