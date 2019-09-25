import gql from "graphql-tag";
import { DataProxy } from "apollo-cache";
import LocationQuery from "./Locations";
import { Locations } from "./__generated__/Locations";
import { FetchResult } from "apollo-link";
import { CreateLocation } from "./__generated__/CreateLocation";

export default {
  mutation: gql`
    mutation CreateLocation($data: LocationInput!) {
      createLocation(data: $data) {
        id
        name
      }
    }
  `,
  update: (proxy: DataProxy, response?: FetchResult<CreateLocation>): void => {
    const data = proxy.readQuery<Locations>(LocationQuery);
    data.locations.push(response.data.createLocation);
    proxy.writeQuery({ ...LocationQuery, data });
  },
};
