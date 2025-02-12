<template>
  <Page actionBarHidden="true">
    <GridLayout class="p-x-20 p-y-10" rows="*" columns="*">
      <ActivityIndicator v-if="loading" busy="true" />
      <ConfirmQRMoneyTransfer v-else-if="type === 'mt'" :id="id" :amount="amount" />
      <ConfirmMedpack v-else-if="type === 'mp'" :code="code" />
      <ConfirmMedicine v-else-if="type === 'me'" :code="code" />
      <ConfirmImplantProlong v-else-if="type === 'ip'" :code="code" />
      <ConfirmItemGift v-else-if="type === 'ig'" :code="code" />
      <Label v-else :text="'Результат: ' + result" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { BarcodeScanner } from "nativescript-barcodescanner";

import ConfirmQRMoneyTransfer from "@/components/ConfirmQRMoneyTransfer.vue";
import ConfirmMedpack from "@/components/ConfirmMedpack.vue";
import ConfirmMedicine from "@/components/ConfirmMedicine.vue";
import ConfirmImplantProlong from "@/components/ConfirmImplantProlong.vue";
import ConfirmItemGift from "@/components/ConfirmItemGift.vue";
import CharacterPage from "./Character.vue";

const barcodescanner = new BarcodeScanner();

@Component({
  components: { ConfirmQRMoneyTransfer, ConfirmMedpack, ConfirmMedicine, ConfirmImplantProlong, ConfirmItemGift },
})
export default class Scan extends Vue {
  @Prop({ type: Array, default: null }) whitelist!: string[];
  result = "";
  loading = true;
  type = "unknown";
  id = -1;
  amount = -1;
  code = "";

  async scan(): Promise<boolean> {
    this.loading = true;
    try {
      const result = await barcodescanner.scan({
        formats: "QR_CODE",
        cancelLabel: "Закрыть", // iOS only, default 'Close'
        cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
        beepOnScan: true, // Play or Suppress beep on scan (default true)
        openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
      });
      this.result = result.text;
      process.nextTick(() => this.recognize(this.result));
      this.loading = false;
      return true;
    } catch (err) {
      if (err === "Please allow access to the Camera and try again.") {
        await alert({
          title: "Доступ к камере",
          message: "Вы должны разрешить доступ к камере, чтобы иметь возможность сканировать QR-код",
          okButtonText: "OK",
        });
      }
      if (err !== "Scan aborted") console.error("Scan error. " + err);
      this.loading = false;
      return false;
    }
  }

  async recognize(result) {
    this.type = "unknown";
    if (result.startsWith("cbrpnk://")) {
      const data = result.substring(9).split("/");
      if (!this.parsers[data[0]]) {
        await alert({
          title: "Ошибка",
          message: "Неизвестный формат QR-кода",
          okButtonText: "ОК",
        });
        return;
      }
      if (this.whitelist && !this.whitelist.includes(data[0])) {
        await alert({
          title: "Ошибка",
          message: "Вы не можете считать этот QR-код сейчас",
          okButtonText: "ОК",
        });
        return;
      }
      let success = false;
      try {
        success = this.parsers[data[0]](data);
      } catch (e) {
        console.error("error parsing qr code", e);
      }
      if (!success)
        await alert({
          title: "Ошибка",
          message: "Неверный QR-код",
          okButtonText: "ОК",
        });
    }
  }

  parsers = {
    mt: this.parseMoneyTransfer,
    c: this.parseCharacter,
    ig: this.parseItemGift,
    ip: this.parseImplantsProlong,
    mp: this.parseMedPack,
    me: this.parseMedicine,
  };

  parseMoneyTransfer(data) {
    if (data.length !== 3) return false;
    this.id = parseInt(data[1]);
    this.amount = parseInt(data[2]);
    this.type = "mt";
    return true;
  }

  parseCharacter(data) {
    if (data.length !== 2) return false;
    const id = parseInt(data[1]);
    this.$navigateTo(CharacterPage, { frame: this.$root.currentFrame, props: { id } });
    return true;
  }

  parseMedPack(data) {
    if (data.length !== 2) return false;
    if (data[1].length !== 16) return false;
    this.code = data[1];
    this.type = "mp";
    return true;
  }

  parseMedicine(data) {
    if (data.length !== 2) return false;
    if (data[1].length !== 16) return false;
    this.code = data[1];
    this.type = "me";
    return true;
  }

  parseImplantsProlong(data) {
    if (data.length !== 2) return false;
    if (data[1].length !== 16) return false;
    this.code = data[1];
    this.type = "ip";
    return true;
  }

  parseItemGift(data) {
    if (data.length !== 2) return false;
    if (data[1].length !== 16) return false;
    this.code = data[1];
    this.type = "ig";
    return true;
  }
}
</script>

<style scoped>
StackLayout {
  height: 100%;
}
</style>
