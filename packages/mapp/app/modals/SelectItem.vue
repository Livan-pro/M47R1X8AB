<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <Label text="Выберите предмет" class="h2 text-center hr-bottom" />
      <ListView for="item in inventory" height="100%" @itemTap="onTap">
        <v-template>
          <InventoryItem :data="item" :isTransferable="false" class="hr-bottom p-y-10" />
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import InventoryItem from "@/components/InventoryItem.vue";

import Inventory from "@/gql/Inventory";
import { Inventory_inventory as Item } from "@/gql/__generated__/Inventory";

@Component({
  components: { InventoryItem },
  apollo: {
    inventory: Inventory,
  },
})
export default class SelectItemModal extends Vue {
  inventory: Item[] = [];

  onTap({ item: { itemId } }: { item: { itemId: number } }) {
    this.$modal.close(itemId);
  }
}
</script>

<style scoped></style>
