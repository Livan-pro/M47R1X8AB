import { ApolloClient } from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import VueApollo from "vue-apollo";
import * as appSettings from "tns-core-modules/application-settings";
import { vue } from "./main";
require("nativescript-websockets");
import { SubscriptionClient } from "subscriptions-transport-ws";

import App from "./pages/App.vue";
import Login from "./pages/Login.vue";
import { NavigationEntryVue } from "nativescript-vue";
import { toIdValue, IdValue } from "apollo-utilities";
import SetFirebaseToken from "./gql/SetFirebaseToken";
import UnsetFirebaseToken from "./gql/UnsetFirebaseToken";

let token: string | undefined = appSettings.getString("token");
let firebaseToken: string | null = null;
let apolloProvider: VueApollo;

const wsClient = new SubscriptionClient(
  ENV_GRAPHQL_WS_URL,
  {
    reconnect: true,
    connectionParams: (): { token: string | undefined } => ({ token }),
  },
  WebSocket,
);
const link = new WebSocketLink(wsClient);

async function setFirebaseToken(token: string): Promise<void> {
  await apolloProvider.defaultClient.mutate({ ...SetFirebaseToken, variables: { token } });
}

async function unsetFirebaseToken(token: string): Promise<void> {
  await apolloProvider.defaultClient.mutate({ ...UnsetFirebaseToken, variables: { token } });
}

export async function updateFirebaseToken(fbToken: string): Promise<void> {
  if (firebaseToken === fbToken) return;
  firebaseToken = fbToken;
  if (!token) return;
  setFirebaseToken(firebaseToken);
}

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
  if (firebaseToken) setFirebaseToken(firebaseToken);
  vue.$navigateTo(App);
}

export function logout(): void {
  if (token) {
    unsetToken();
    vue.$navigateTo(Login, ({ clearHistory: true } as unknown) as NavigationEntryVue);
  }
  if (firebaseToken) unsetFirebaseToken(firebaseToken);
}

const logoutLink = onError(({ graphQLErrors, networkError }): void => {
  console.error("apollo error", networkError, graphQLErrors);
  if (
    graphQLErrors &&
    graphQLErrors.length >= 1 &&
    graphQLErrors[0].message &&
    ((graphQLErrors[0].message as unknown) as { statusCode: number }).statusCode === 401
  )
    logout();
});

const dataIdFromObject = defaultDataIdFromObject;

const fromCache = (type: string): ((_, { id }) => IdValue) => (_, { id }): IdValue => toIdValue(dataIdFromObject({ __typename: type, id }));

// Cache implementation
const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      character: fromCache("Character"),
    },
  },
  dataIdFromObject,
});

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: logoutLink.concat(link),
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

apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

export { apolloProvider };
