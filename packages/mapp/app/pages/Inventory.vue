<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Инвентарь" class="h1 text-center" />
        <template v-for="(item, i) in inventory">
          <StackLayout :key="'hr-' + i" class="hr-light m-b-10" />
          <InventoryItem :key="i" :data="item" />
        </template>
        <StackLayout class="hr-light" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import InventoryItem from "@/components/InventoryItem.vue";

import inventory from "@/gql/Inventory";
import me from "@/gql/MainCharacterInfo";
import { Inventory_inventory as Item } from "@/gql/__generated__/Inventory";
import { MainCharacterInfo_me as Me } from "@/gql/__generated__/MainCharacterInfo";

@Component({
  components: { InventoryItem },
  apollo: {
    inventory,
    me,
  },
})
export default class InventoryPage extends Vue {
  inventory: Item[] = [];
  me: Me = {
    __typename: "User",
    mainCharacter: {
      __typename: "Character",
      id: -1,
      name: "",
      avatarUploadedAt: null,
      own: true,
    },
  };
}
</script>

<style scoped></style>
