import { Context } from "@nuxt/vue-app";

export default (error: any, { redirect }: Context): void => {
  if (error.gqlError && error.gqlError.message.statusCode && error.gqlError.message.statusCode === 401) {
    // eslint-disable-next-line no-console
    console.log("Not authenticated");
    redirect("/login");
  } else {
    // eslint-disable-next-line no-console
    console.log("%cGQL Error", "background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;", error);
  }
};
