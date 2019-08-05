import { Context } from "@nuxt/vue-app";
import MyEmail from "~/gql/MyEmail";
import { Route } from "vue-router";

export function getMetaAuth(route: Route): null | undefined | boolean {
  if (!Array.isArray(route.meta)) return undefined;
  return route.meta.reduce(
    (acc: boolean | undefined | null, meta: { auth?: boolean | null }): boolean | null => (meta.auth === undefined ? acc : meta.auth),
    undefined,
  );
}

export function check(auth: null | undefined | boolean, data: any, redirect: Context["redirect"]): void {
  const loggedIn = !!(data && data.me);
  if (auth === loggedIn) return;
  if (loggedIn) {
    // eslint-disable-next-line no-console
    console.log("[auth] redirect to /");
    return redirect("/");
  } else {
    // eslint-disable-next-line no-console
    console.log("[auth] redirect to /login");
    return redirect("/login");
  }
}

export default async function({ app, redirect, route }: Context): Promise<void> {
  const auth = getMetaAuth(route);
  if (auth === null || auth === undefined) return;
  try {
    if (!app || !app.apolloProvider || !app.apolloProvider.defaultClient) {
      // eslint-disable-next-line no-console
      console.error("[auth] apollo client not found");
      return;
    }
    const data = await app.apolloProvider.defaultClient.query({ ...MyEmail, fetchPolicy: "cache-first" });
    check(auth, data.data, redirect);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[auth] error: ${err.stack}`);
  }
}
