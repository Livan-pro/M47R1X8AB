import Vue from "nativescript-vue";
import VueDevtools from "nativescript-vue-devtools";
import * as appSettings from "tns-core-modules/application-settings";
import VueApollo from "vue-apollo";
import { apolloProvider, updateFirebaseToken } from "./vue-apollo";

import App from "./pages/App.vue";
import Login from "./pages/Login.vue";
import { VNode } from "vue";

import firebase, { Message } from "nativescript-plugin-firebase";

// Fix for qrcode generation & potential fix for other libs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.nextTick = (callback: () => any, ...args: any[]): void => {
  setTimeout(callback, 0, ...args);
};

if (TNS_ENV !== "production") {
  Vue.use(VueDevtools, { host: ENV_DEV_HOST });
}

Vue.use(VueApollo);

// prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production";

// Custom elements
/* eslint-disable @typescript-eslint/explicit-function-return-type */
Vue.registerElement("VideoPlayer", () => require("nativescript-videoplayer").Video);
/* eslint-enable @typescript-eslint/explicit-function-return-type */

const isLoggedIn = appSettings.hasKey("token");

firebase
  .init({
    showNotificationsWhenInForeground: true,
    onPushTokenReceivedCallback: (token: string): void => {
      updateFirebaseToken(token);
    },
    onMessageReceivedCallback: async (message: Message): Promise<void> => {
      if (message.foreground) {
        await alert({
          title: message.title,
          message: message.body,
        });
      } // TODO: else => open specific activity
    },
  })
  .then(
    (): void => {
      console.log("firebase.init done");
    },
    (error): void => {
      console.log(`firebase.init error: ${error}`);
    },
  );

export const vue = new Vue({
  apolloProvider,
  data: {
    currentFrame: "",
  },
  render: (h): VNode => h("frame", [isLoggedIn ? h(App) : h(Login)]),
});

vue.$start();
