import gql from "graphql-tag";

export const query = gql`{
  me {
    email
  }
}`;

export function error(err: any) {
  // nothing
}

export const errorPolicy = "ignore";
export const fetchPolicy = "cache-and-network";
