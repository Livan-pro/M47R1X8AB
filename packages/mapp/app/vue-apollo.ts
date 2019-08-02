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

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const logoutLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors && graphQLErrors.length >= 1 && graphQLErrors[0].message && graphQLErrors[0].message.statusCode === 401) logout();
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: logoutLink.concat(authLink.concat(httpLink)),
  cache,
});

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

export function setToken(newToken: string) {
  token = newToken;
  appSettings.setString("token", token);
}

export function unsetToken() {
  token = undefined;
  appSettings.remove("token");
}

export function login(newToken: string) {
  setToken(newToken);
  vue.$navigateTo(App);
}

export function logout() {
  unsetToken();
  vue.$navigateTo(Login);
}