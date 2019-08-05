import * as me from "@/graphql/me";
import { Context } from "@nuxt/vue-app";

export function getMetaAuth(route: any): null | undefined | boolean {
  if (!Array.isArray(route.meta)) return undefined;
  return route.meta.reduce((acc: any, meta: any) => meta.auth === undefined ? acc : meta.auth, undefined);
}

export function check(auth: null | undefined | boolean, data: any, redirect: Context["redirect"]) {
  const loggedIn = !!(data && data.me);
  if (auth === loggedIn) return;
  if (loggedIn) {
    // tslint:disable-next-line:no-console
    console.log("[auth] redirect to /profile");
    return redirect("/profile");
  } else {
    // tslint:disable-next-line:no-console
    console.log("[auth] redirect to /login");
    return redirect("/login");
  }
}

export default async function({ app, redirect, route }: Context) {
  const auth = getMetaAuth(route);
  if (auth === null || auth === undefined) return;
  try {
    if (!app || !app.apolloProvider || !app.apolloProvider.defaultClient) {
      // tslint:disable-next-line:no-console
      console.error("[auth] apollo client not found");
      return;
    }
    const data = await app.apolloProvider.defaultClient.query({...me, fetchPolicy: "cache-first"});
    check(auth, data.data, redirect);
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(`[auth] error: ${err.stack}`);
    return;
  }
}
