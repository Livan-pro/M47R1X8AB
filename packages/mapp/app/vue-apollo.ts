import { ApolloClient } from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import VueApollo from "vue-apollo";
import * as appSettings from "tns-core-modules/application-settings";
import { vue } from "./main";
require("nativescript-websockets");
import { SubscriptionClient } from "subscriptions-transport-ws";

import App from "./pages/App.vue";
import Login from "./pages/Login.vue";

let token: string | undefined = appSettings.getString("token");

const wsClient = new SubscriptionClient(
  ENV_GRAPHQL_WS_URL,
  {
    reconnect: true,
    connectionParams: (): { token: string | undefined } => ({ token }),
  },
  WebSocket,
);
const link = new WebSocketLink(wsClient);

export function setToken(newToken: string): void {
  token = newToken;
  appSettings.setString("token", token);
  wsClient.close(false, false); // reconnect
}

export function unsetToken(): void {
  token = undefined;
  appSettings.remove("token");
  wsClient.close(false, false); // reconnect
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
  link: logoutLink.concat(authLink.concat(link)),
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
