// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as nv from "nativescript-vue";

declare module "nativescript-vue" {
  export interface NavigationEntryVue {
    frame: string;
  }
}
