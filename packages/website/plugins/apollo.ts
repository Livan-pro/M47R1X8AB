export default () => ({
  httpEndpoint: '/graphql',
  httpLinkOptions: {
    credentials: 'same-origin'
  },
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false, // Optional
});
