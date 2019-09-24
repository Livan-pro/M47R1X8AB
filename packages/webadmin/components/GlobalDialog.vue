<template>
  <v-dialog v-model="dialog" max-width="290">
    <v-card>
      <v-card-title class="headline" v-if="title">{{ title }}</v-card-title>
      <v-card-text v-if="text">
        {{ text }}
        <v-text-field v-if="isInputVisible" v-model="inputValue" :label="inputLabel" hide-details />
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn :color="color" :loading="loading" text @click="confirm">{{ buttonText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

export interface DialogOptions {
  title?: string;
  text?: string;
  color?: string;
  buttonText?: string;
  inputLabel?: string;
  callback: () => Promise<void> | void;
}

@Component
export default class GlobalDialog extends Vue {
  dialog = false;
  loading = false;

  title: string | null = null;
  text: string | null = null;
  color = "primary";
  buttonText = "Подтвердить";
  inputLabel: string | null = null;
  callback: () => Promise<void> | void = () => {};

  inputValue: string = "";

  created() {
    this.$root.$on("dialog", this.open);
  }

  open(options: DialogOptions) {
    this.dialog = true;
    this.title = options.title || null;
    this.text = options.text || null;
    this.color = options.color || "primary";
    this.buttonText = options.buttonText || "Подтвердить";
    this.inputLabel = options.inputLabel || null;
    this.inputValue = "";
    this.callback = options.callback;
  }

  get isInputVisible() {
    return this.inputLabel !== null;
  }

  async confirm() {
    this.loading = true;
    if (this.isInputVisible) await this.callback(this.inputValue);
    else await this.callback(this.inputValue);
    this.loading = false;
    this.dialog = false;
  }
}
</script>
