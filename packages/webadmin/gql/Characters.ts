import gql from "graphql-tag";

export default {
  query: gql`
    query Characters {
      characters {
        id
        userId
        name
        quenta
        roles
        profession
        registrationProfession
        professionLevel
        avatarUploadedAt
        balance
        state
        pollution
        deathTime
        implantsRejectTime
        location {
          name
        }
      }
    }
  `,
};
