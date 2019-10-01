<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Использование предмета" dock="left" class="h2" />
        <Label :text="`У вас: ${total}`" dock="left" class="h3" />
        <TextField v-model="amount" hint="Количество" keyboardType="number" returnKeyType="done" @returnPress="doConsume" />
        <LoadingButton :loading="loading" text="Использовать" @tap="doConsume" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import LoadingButton from "@/components/LoadingButton.vue";

import ItemConsume from "@/gql/ItemConsume";
import { items } from "@/utils/items";

@Component({ components: { LoadingButton } })
export default class ItemConsumeAmountModal extends Vue {
  @Prop({ type: Number, default: -1 }) itemId!: number;
  @Prop({ type: Number, default: -1 }) total!: number;
  amount = "";
  loading = false;

  async doConsume() {
    this.loading = true;
    const amount = parseInt(this.amount, 10);
    try {
      await this.$apollo.mutate({
        ...ItemConsume,
        variables: {
          itemId: this.itemId,
          amount,
        },
      });
      await alert({
        title: "Успех",
        message: `Вы использовали ${amount} предметов типа ${this.item.name}`,
        okButtonText: "ОК",
      });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(JSON.stringify(error));
      const message = ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message;
      await alert({
        title: "Ошибка",
        message,
        okButtonText: "ОК",
      });
    }
    this.loading = false;
    this.$modal.close();
  }

  get item() {
    return items[this.itemId] || { name: "Неизвестный предмет" };
  }
}
</script>

<style scoped>
button {
  margin: 16px 0;
}
</style>
