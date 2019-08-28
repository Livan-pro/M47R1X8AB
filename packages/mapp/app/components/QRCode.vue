<template>
  <Image :src="dataUrl" :width="size" :height="size" />
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import Vue from "nativescript-vue";
import QRCodeLib from "qrcode";

@Component
export default class QRCode extends Vue {
  @Prop({ type: String, default: "" }) text!: string;
  @Prop({ type: Number, default: 250 }) size!: number;

  dataUrl = "";

  async created() {
    console.log("created", this.text);
    this.updateQR();
  }

  @Watch("text")
  async updateQR() {
    try {
      console.log("text_", this.text);
      QRCodeLib.toDataURL(this.text, (err, url) => {
        if (err) {
          console.error("qrcode generation error2", err);
          return;
        }
        this.dataUrl = url;
        console.log("dataUrl", this.dataUrl);
      });
    } catch (err) {
      console.error("qrcode generation error", err);
    }
  }
}
</script>

<style scoped></style>
