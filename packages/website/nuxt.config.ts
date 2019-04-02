export default {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: "Cyberpunk",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#002637' },
      { hid: 'description', name: 'description', content: "description" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [,
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/apollo',
    '@nuxtjs/proxy'
  ],
  bootstrapVue: {
    bootstrapCSS: true, // or `css`
    bootstrapVueCSS: true // or `bvCSS`
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config: any, ctx: any) {
      
    }
  },
  apollo: {
    errorHandler (error: any) {
      if (error.gqlError && error.gqlError.message.statusCode && error.gqlError.message.statusCode === 401) {
        console.log("Not authenticated");
      } else {
        console.log('%cGQL Error', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error);
      }
    },
    clientConfigs: {
      default: "@/plugins/apollo",
    }
  },
  proxy: [
    "http://localhost:3001/graphql"
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
}