import ru from "vuetify/es5/locale/ru";

export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: "Webadmin",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@mdi/font@3.x/css/materialdesignicons.min.css" },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["~/assets/style/app.sass"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    "@nuxtjs/eslint-module",
    "@nuxtjs/vuetify",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/apollo", "@nuxtjs/proxy", "@nuxtjs/dotenv"],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/style/variables.sass"],
    lang: { locales: { ru }, current: "ru" },
  },
  apollo: {
    errorHandler: "@/plugins/apollo-error-handler",
    clientConfigs: {
      default: {
        httpEndpoint: "/graphql",
        httpLinkOptions: {
          credentials: "same-origin",
        },
        // enable Automatic Query persisting with Apollo Engine
        persisting: false, // optional
      },
    },
  },
  proxy: ["http://localhost:3001/graphql", "http://localhost:3001/data"],
  server: {
    host: "0.0.0.0",
    port: 3002,
  },
  router: {
    middleware: "auth",
  },
};
