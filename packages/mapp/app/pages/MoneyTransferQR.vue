<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Создание QR-кода для перевода денег" dock="left" class="h2" textWrap="true" />
        <TextField v-model="amount" hint="Сумма" keyboardType="number" returnKeyType="done" @returnPress="createQR" />
        <Button text="Создать" @tap="createQR" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import QRCode from "@/components/QRCode.vue";

@Component
export default class MoneyTransferQRPage extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  amount = "";

  async createQR() {
    const amount = parseInt(this.amount, 10);
    if (!(amount > 0)) {
      if (amount < 1)
        await alert({
          title: "Ошибка",
          message: "Сумма должна быть больше 0",
          okButtonText: "ОК",
        });
      else
        await alert({
          title: "Ошибка",
          message: "Вы должны ввести сумму для перевода",
          okButtonText: "ОК",
        });
      return;
    }
    this.$showModal(QRCode, { props: { text: `cbrpnk://mt/${this.id}/${this.amount}` } });
  }
}
</script>

<style scoped>
button {
  margin: 16px 0;
}
</style>
