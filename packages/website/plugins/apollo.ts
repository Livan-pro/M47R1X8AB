export default () => ({
  httpEndpoint: "/graphql",
  httpLinkOptions: {
    credentials: "same-origin"
  },
  // enable Automatic Query persisting with Apollo Engine
  persisting: false, // optional
});
