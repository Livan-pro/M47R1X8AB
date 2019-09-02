<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <Label :text="`Ваш баланс: ${balance}`" dock="left" class="h2" />
      <StackLayout class="hr-light m-y-10" />
      <Menu :items="items" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";

import Menu from "@/components/Menu.vue";
import SelectCharacter from "@/modals/SelectCharacter.vue";
import MoneyTransferAmount from "@/modals/MoneyTransferAmount.vue";
import MoneyTransferQRPage from "./MoneyTransferQR.vue";

import me from "@/gql/MyIDAndBalance";
import { MyIDAndBalance_me as MeType } from "@/gql/__generated__/MyIDAndBalance";

@Component({
  components: { Menu },
  apollo: {
    me,
  },
})
export default class MoneyPage extends Vue {
  me: MeType = {
    __typename: "User",
    mainCharacter: {
      __typename: "Character",
      id: -1,
      balance: null,
    },
  };
  get items() {
    return [
      {
        title: "Перевод",
        action: async () => {
          const id = await this.$showModal(SelectCharacter, { fullscreen: true });
          await this.$showModal(MoneyTransferAmount, { props: { id } });
        },
      },
      { title: "Создать QR-код", open: MoneyTransferQRPage, props: { id: this.characterId } },
    ];
  }

  get characterId() {
    const me = this.me as MeType;
    return (me && me.mainCharacter && me.mainCharacter.id) || -1;
  }

  get balance() {
    const me = this.me as MeType;
    return (me && me.mainCharacter && me.mainCharacter.balance) || 0;
  }
}
</script>
