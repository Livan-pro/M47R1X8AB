<template>
  <v-layout justify-center>
    <QRCodeEditor
      title="QR-коды предметов"
      createTitle="Создание QR-кода предмета"
      :list="itemGifts"
      :create="createItemGift"
      :fields="fields"
      :getQrText="getQrText"
    />
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import QRCodeEditor from "~/components/QRCodeEditor.vue";
import itemGifts from "~/gql/ItemGifts";
import { ItemGifts_itemGifts as ItemGift } from "~/gql/__generated__/ItemGifts";
import CreateItemGift from "~/gql/CreateItemGift";

@Component({
  components: {
    QRCodeEditor,
  },
  apollo: {
    itemGifts,
  },
  meta: {
    auth: true,
  },
})
export default class ItemGiftsPage extends Vue {
  itemGifts: ItemGift[] = [];

  get fields() {
    return [{ name: "itemId", label: "ID предмета", type: "number" }, { name: "amount", label: "Количество", type: "number" }];
  }

  async createItemGift(variables: object) {
    await this.$apollo.mutate({ ...CreateItemGift, variables });
  }

  getQrText(item: ItemGift) {
    return item ? `cbrpnk://ig/${item.code}` : "";
  }
}
</script>
