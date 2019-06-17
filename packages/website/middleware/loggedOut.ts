import { query as me } from "@/graphql/me";

export default async function({ app, redirect }: any) {
  try {
    const data = await app.apolloProvider.defaultClient.query({query: me, fetchPolicy: "cache-only"});
    if (data.data.me !== null) return redirect("/profile");
  } catch (err) {}
}
