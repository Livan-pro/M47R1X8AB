import gql from "graphql-tag";

export default {
  query: gql`
    query MyRoles {
      me {
        roles
        mainCharacter {
          id
          roles
          profession
        }
      }
    }
  `,
};
