import Vue from "nativescript-vue";
import VueDevtools from "nativescript-vue-devtools";
import * as appSettings from "tns-core-modules/application-settings";
import VueApollo from "vue-apollo";
import { apolloProvider } from "./vue-apollo";

import App from "./pages/App.vue";
import Login from "./pages/Login.vue";
import { VNode } from "vue";

if (TNS_ENV !== "production") {
  Vue.use(VueDevtools, { host: ENV_DEV_HOST });
}

Vue.use(VueApollo);

// prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production";

const isLoggedIn = appSettings.hasKey("token");

export const vue = new Vue({
  apolloProvider,
  data: {
    currentFrame: "",
  },
  render: (h): VNode => h("frame", [isLoggedIn ? h(App) : h(Login)]),
});

vue.$start();
