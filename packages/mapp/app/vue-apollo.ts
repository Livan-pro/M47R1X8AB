import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import VueApollo from "vue-apollo";
import * as appSettings from "tns-core-modules/application-settings";
import { vue } from "./main";

import App from "./pages/App.vue";
import Login from "./pages/Login.vue";

const production = TNS_ENV === "production";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: production ? "https://cyberpunk2219.tech/graphql" : ENV_GRAPHQL_URL,
});

let token = appSettings.getString("token");

export function setToken(newToken: string): void {
  token = newToken;
  appSettings.setString("token", token);
}

export function unsetToken(): void {
  token = undefined;
  appSettings.remove("token");
}

export function login(newToken: string): void {
  setToken(newToken);
  vue.$navigateTo(App);
}

export function logout(): void {
  if (token) {
    unsetToken();
    vue.$navigateTo(Login);
  }
}

const authLink = setContext((_, { headers }): unknown => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const logoutLink = onError(({ graphQLErrors }): void => {
  if (
    graphQLErrors &&
    graphQLErrors.length >= 1 &&
    graphQLErrors[0].message &&
    ((graphQLErrors[0].message as unknown) as { statusCode: number }).statusCode === 401
  )
    logout();
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: logoutLink.concat(authLink.concat(httpLink)),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
});

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});
