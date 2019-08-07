import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import { UserRole as Role } from "./__generated__/globalTypes";

export default {
  mutation: gql`
    mutation MakeAdmin($id: Int!, $value: Boolean!) {
      setUserRole(id: $id, role: Admin, value: $value)
    }
  `,
};

export const createUpdate = (id: number, value: boolean): ((proxy: DataProxy) => void) => {
  return (proxy: DataProxy): void => {
    const fragment = {
      id: `User:${id}`,
      fragment: gql`
        fragment roles on User {
          roles
        }
      `,
    };
    const { roles } = proxy.readFragment(fragment);
    if (value) {
      if (roles.includes(Role.Admin)) return;
      roles.push(Role.Admin);
    } else {
      const idx = roles.indexOf(Role.Admin);
      if (idx === -1) return;
      else roles.splice(idx, 1);
    }
    proxy.writeFragment({
      ...fragment,
      data: {
        __typename: "User",
        roles,
      },
    });
  };
};
