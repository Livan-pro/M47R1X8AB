<template>
  <Page>
    <ActionBar title="Матрица 2219" android:flat="true" />
    <TabView
      class="nav"
      android-tabs-position="bottom"
      android-selected-tab-highlight-color="#ffffff"
      :tab-text-font-size="20"
      :selected-index="selectedIndex"
      @selectedIndexChange="onSelectedIndexChange"
    >
      <TabViewItem class="fas" :title="'\uf1ea'">
        <Frame id="f0">
          <News />
        </Frame>
      </TabViewItem>
      <TabViewItem class="fas" :title="'\uf0c0'">
        <Frame id="f1">
          <Characters />
        </Frame>
      </TabViewItem>
      <TabViewItem class="fas" :title="'\uf029'">
        <Frame id="f2">
          <ScanResult :loading="scanLoading" :result="scanResult" />
        </Frame>
      </TabViewItem>
      <TabViewItem class="fas" :title="'\uf0c9'">
        <Frame id="f3">
          <Menu />
        </Frame>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { BarcodeScanner } from "nativescript-barcodescanner";

import News from "./News.vue";
import Characters from "./Characters.vue";
import ScanResult from "./ScanResult.vue";
import Menu from "./Menu.vue";

const barcodescanner = new BarcodeScanner();

@Component({
  components: { News, Characters, ScanResult, Menu },
})
export default class App extends Vue {
  selectedIndex: number = 0;
  scanResult: string = "";
  scanLoading = true;

  async onSelectedIndexChange({ value, oldValue }) {
    this.$root.currentFrame = "f" + value;
    if (value === 2) if (!(await this.scan())) this.selectedIndex = oldValue;
  }

  async scan(): Promise<boolean> {
    this.scanLoading = true;
    try {
      const result = await barcodescanner.scan({
        formats: "QR_CODE",
        cancelLabel: "Закрыть", // iOS only, default 'Close'
        cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
        beepOnScan: true, // Play or Suppress beep on scan (default true)
        openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
      });
      this.scanResult = result.text;
      this.scanLoading = false;
      return true;
    } catch (err) {
      if (err === "Please allow access to the Camera and try again.") {
        await alert({
          title: "Доступ к камере",
          message: "Вы должны разрешить доступ к камере, чтобы иметь возможность сканировать QR-код",
          okButtonText: "OK",
        });
      }
      console.log("Scan error. " + err);
      return false;
    }
  }
}
</script>

<style scoped></style>
