<template>
  <v-dialog v-model="dialog" max-width="290">
    <v-card>
      <v-card-title class="headline" v-if="title">{{ title }}</v-card-title>
      <v-card-text v-if="text">{{ text }}</v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn :color="color" :loading="loading" text @click="confirm">{{ buttonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

export interface ConfirmDialogOptions {
  title?: string;
  text?: string;
  color?: string;
  buttonText?: string;
  callback: () => Promise<void> | void;
}

@Component
export default class GlobalConfirmDialog extends Vue {
  dialog = false;
  loading = false;

  title: string | null = null;
  text: string | null = null;
  color = "primary";
  buttonText = "Подтвердить";
  callback: () => Promise<void> | void = () => {};

  created() {
    this.$root.$on("confirm", this.open);
  }

  open(options: ConfirmDialogOptions) {
    this.dialog = true;
    this.title = options.title || null;
    this.text = options.text || null;
    this.color = options.color || "primary";
    this.buttonText = options.buttonText || "Подтвердить";
    this.callback = options.callback;
  }

  async confirm() {
    this.loading = true;
    await this.callback();
    this.loading = false;
    this.dialog = false;
  }
}
</script>
