import Vue from "nativescript-vue";
import App from "./components/App.vue";
import Login from "./components/Login.vue";
import * as appSettings from "tns-core-modules/application-settings";

import VueDevtools from "nativescript-vue-devtools";

if (TNS_ENV !== "production") {
  Vue.use(VueDevtools);
}

// prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === "production");

const isLoggedIn = appSettings.hasKey("token");

new Vue({
  render: h => h("frame", [isLoggedIn ? h(App) : h(Login)]),
}).$start();
