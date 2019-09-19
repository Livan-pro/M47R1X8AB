import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import { properties as Properties, properties_properties as Property } from "./__generated__/properties";

export default {
  mutation: gql`
    mutation EditProperty($characterId: Int!, $name: String!, $value: String!) {
      editProperty(characterId: $characterId, name: $name, value: $value)
    }
  `,
};

export const createUpdate = (characterId: number, name: string, value: string): ((proxy: DataProxy) => void) => {
  return (proxy: DataProxy): void => {
    const fragment = gql`
      fragment properties on Character {
        properties {
          name
          value
        }
      }
    `;
    const id = `Character:${characterId}`;
    const data = proxy.readFragment<Properties>({
      id,
      fragment,
    });
    const properties = data.properties;
    const newProp: Property = { __typename: "Property", name, value };
    const idx = properties.findIndex((prop): boolean => prop.name === name);
    if (idx < 0) {
      if (value.length) properties.push(newProp);
    } else {
      if (value.length) properties[idx] = newProp;
      else properties.splice(idx, 1);
    }
    proxy.writeFragment<Properties>({
      id,
      fragment,
      data: {
        __typename: "Character",
        properties,
      },
    });
  };
};
