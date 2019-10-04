import Vue from "nativescript-vue";
import VueDevtools from "nativescript-vue-devtools";
import * as appSettings from "tns-core-modules/application-settings";
import VueApollo from "vue-apollo";
import { apolloProvider, updateFirebaseToken } from "./vue-apollo";

import App from "./pages/App.vue";
import Login from "./pages/Login.vue";
import MessagesPage from "./pages/Messages.vue";
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

let vue: Vue;
const isLoggedIn = appSettings.hasKey("token");

const confirm = ((global as unknown) as {
  confirm: (
    message?:
      | string
      | {
          title: string;
          message: string;
          okButtonText: string;
          cancelButtonText: string;
        },
  ) => Promise<boolean>;
}).confirm;

function isChatOpen(chatId: number): boolean {
  return vue.currentChat === chatId;
}

export const onMessage = async (message: Message): Promise<void> => {
  if (message.foreground) {
    if (message.data) {
      let chatId: number;
      if (message.data.type === "NewMessage") chatId = +message.data.chatId;
      else if (message.data.type === "BroadcastMessage") chatId = +message.data.fromId;
      else return;
      if (isChatOpen(chatId)) return;
      const res = await confirm({
        title: message.title,
        message: message.body,
        okButtonText: "Перейти",
        cancelButtonText: "Закрыть",
      });
      if (!res) return;
      vue.$navigateTo(MessagesPage, { frame: "f4", props: { id: chatId } });
      vue.$emit("selectTab", 4);
    } else {
      await alert({
        title: message.title,
        message: message.body,
      });
    }
  } // TODO: else => open specific activity
};

firebase
  .init({
    showNotificationsWhenInForeground: true,
    onPushTokenReceivedCallback: (token: string): void => {
      updateFirebaseToken(token);
    },
    onMessageReceivedCallback: onMessage,
  })
  .then(
    (): void => {
      console.log("firebase.init done");
    },
    (error): void => {
      console.log(`firebase.init error: ${error}`);
    },
  );

vue = new Vue({
  apolloProvider,
  data: {
    currentFrame: "",
    currentChat: null,
  },
  render: (h): VNode => h("frame", [isLoggedIn ? h(App) : h(Login)]),
});

export { vue };

vue.$start();
