import { Vue } from "vue/types/vue";

declare module "vue/types/vue" {
  interface Vue {
    currentFrame: string;
    currentChat: number | null;
  }
}
