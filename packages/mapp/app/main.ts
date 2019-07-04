import Vue from "nativescript-vue";
import VueDevtools from "nativescript-vue-devtools";
import * as appSettings from "tns-core-modules/application-settings";
import VueApollo from "vue-apollo";
import { apolloProvider } from "./vue-apollo";

import App from "./components/App.vue";
import Login from "./components/Login.vue";

if (TNS_ENV !== "production") {
  Vue.use(VueDevtools);
}

Vue.use(VueApollo);

// prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === "production");

const isLoggedIn = appSettings.hasKey("token");

export const vue = new Vue({
  apolloProvider,
  render: h => h("frame", [isLoggedIn ? h(App) : h(Login)]),
});

vue.$start();
