import { User, Role } from "matrix-database";
import { User as GqlUser, Role as GqlRole } from "graphql.schema";

export function mapUser(user: User): GqlUser {
  const roles = user.roles.toArray().map(r => Role[r]).filter(r => r !== "LoggedIn") as GqlRole[];
  return {...user, roles};
}