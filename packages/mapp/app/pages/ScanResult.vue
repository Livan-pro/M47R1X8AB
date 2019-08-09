<template>
  <Page action-bar-hidden="true">
    <GridLayout class="p-x-20 p-y-10" rows="*" columns="*">
      <ActivityIndicator v-if="loading" busy="true" />
      <ConfirmQRMoneyTransfer v-else-if="type === 'mt'" :id="id" :amount="amount" />
      <Label v-else :text="'Результат: ' + result" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import Vue from "nativescript-vue";
import ConfirmQRMoneyTransfer from "@/components/ConfirmQRMoneyTransfer.vue";

@Component({
  components: { ConfirmQRMoneyTransfer },
})
export default class ScanResult extends Vue {
  @Prop({ type: Boolean }) loading!: boolean;
  @Prop({ type: String }) result!: string;
  type = "unknown";
  id = -1;
  amount = -1;

  @Watch("result")
  async onResultChanged(result) {
    this.type = "unknown";
    if (result.startsWith("cbrpnk://")) {
      const data = result.substring(9).split("/");
      if (!this.parsers[data[0]])
        await alert({
          title: "Ошибка",
          message: "Неизвестный формат QR-кода",
          okButtonText: "ОК",
        });
      let success = false;
      try {
        success = this.parsers[data[0]](data);
      } catch (e) {}
      if (!success)
        await alert({
          title: "Ошибка",
          message: "Неверный QR-код",
          okButtonText: "ОК",
        });
    }
  }

  parsers = {
    mt: this.parseMT,
  };

  parseMT(data) {
    if (data.length !== 3) return false;
    this.id = parseInt(data[1]);
    this.amount = parseInt(data[2]);
    this.type = "mt";
    return true;
  }
}
</script>

<style scoped>
StackLayout {
  height: 100%;
}
</style>
