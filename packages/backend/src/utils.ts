import { User, Role } from "matrix-database";
import { User as GqlUser, Role as GqlRole } from "graphql.schema";

export function mapUser(user: User, self: User): GqlUser {
  const data = [];
  if (user.roles) data.push({roles: user.roles.toArray().map(r => Role[r]).filter(r => r !== "LoggedIn")});
  if (user.mainCharacter) data.push({mainCharacter: {...user.mainCharacter, own: self.id === user.mainCharacter.id}});
  if (user.characters) data.push({characters: {characters: user.characters.map(c => ({...c, own: self.id === c.userId}))}});
  return Object.assign({}, user, ...data);
}
