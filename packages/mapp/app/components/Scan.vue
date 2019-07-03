<template>
  <StackLayout class="p-x-20 p-y-10">
    <Label text="Сканирование QR-кода" />
    <Button @tap="scan" text="Scan" />
    <Label :text="'Результат: ' + result" />
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { BarcodeScanner } from "nativescript-barcodescanner";

const barcodescanner = new BarcodeScanner();

@Component
export default class Scan extends Vue {
  result = "";

  async mounted() {
    await this.scan();
  }

  async scan() {
    try {
      const result = await barcodescanner.scan({
        formats: "QR_CODE",
        cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
        cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
        message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
        showFlipCameraButton: true,   // default false
        preferFrontCamera: false,     // default false
        showTorchButton: true,        // default false
        beepOnScan: true,             // Play or Suppress beep on scan (default true)
        torchOn: false,               // launch with the flashlight on (default false)
        closeCallback: () => { console.log("Scanner closed"); }, // invoked when the scanner was closed (success or abort)
        resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
        orientation: "portrait",     // Android only, default undefined (sensor-driven orientation), other options: portrait|landscape
        openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
      });
      console.log("result", result);
      this.result = result.text;
    } catch (err) {
      console.log("No scan. " + err);
    }
  }
}
</script>

<style scoped>
</style>
