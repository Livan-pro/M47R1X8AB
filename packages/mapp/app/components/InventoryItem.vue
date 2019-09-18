<template>
  <StackLayout class="p-b-10" orientation="horizontal">
    <StackLayout>
      <Label :text="name" dock="left" class="h2" />
      <Button text="Передать" @tap="transfer" />
    </StackLayout>
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { items } from "@/utils/items";

import SelectCharacter from "@/modals/SelectCharacter.vue";
import ItemTransferAmount from "@/modals/ItemTransferAmount.vue";

@Component
export default class InventoryItem extends Vue {
  @Prop({ type: Object, default: {} }) data!: {
    itemId: number;
    amount: number;
  };

  async transfer() {
    const characterId = await this.$showModal(SelectCharacter, { fullscreen: true });
    await this.$showModal(ItemTransferAmount, { props: { characterId, itemId: this.data.itemId } });
  }

  get item() {
    return items[this.data.itemId] || { name: "Неизвестный предмет" };
  }

  get name() {
    return `${this.item.name} (${this.data.amount})`;
  }
}
</script>

<style scoped lang="scss"></style>
