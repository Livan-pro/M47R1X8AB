<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout">
    {{ text }}
    <v-btn dark text @click="show = false">
      Закрыть
    </v-btn>
  </v-snackbar>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

export interface SnackbarOptions {
  text?: string;
  color?: string;
  timeout?: number;
}

@Component
export default class GlobalSnackbar extends Vue {
  show = false;
  timeout = 2000;
  color = "primary";
  text = "";

  created() {
    this.$root.$on("snackbar", this.showSnackbar);
  }

  showSnackbar(options: SnackbarOptions) {
    this.show = true;
    this.text = options.text || "";
    this.color = options.color || "primary";
    this.timeout = options.timeout || 3000;
  }
}
</script>
