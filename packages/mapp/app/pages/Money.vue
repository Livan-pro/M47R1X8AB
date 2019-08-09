<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <Label :text="`Ваш баланс: ${balance}`" dock="left" class="h2" />
      <StackLayout class="hr-light m-y-10" />
      <Menu :items="items"/>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import gql from "graphql-tag";
import { logout } from "@/vue-apollo";

import Menu from "@/components/Menu.vue";
import SelectCharacter from "@/modals/SelectCharacter.vue";
import MoneyTransferAmount from "@/modals/MoneyTransferAmount.vue";
import MoneyTransferQRPage from './MoneyTransferQR.vue';

@Component({
  components: { Menu },
  apollo: {
    me: {
      query: gql`{
        me {
          mainCharacter {
            id
            balance
          }
        }
      }`,
      fetchPolicy: "cache-and-network",
    },
  },
})
export default class MoneyPage extends Vue {
  me: any = {};
  get items() {
    return [
      {title: "Перевод", action: async () => {
        const id = await this.$showModal(SelectCharacter, {fullscreen: true});
        console.log(`Selected ID: ${id}`);
        await this.$showModal(MoneyTransferAmount, {props: {id}});
      }},
      {title: "Создать QR-код", open: MoneyTransferQRPage, props: {id: this.characterId}},
    ];
  }

  get characterId() {
    return (this.me && this.me.mainCharacter && this.me.mainCharacter.id) || -1;
  }

  get balance() {
    return (this.me && this.me.mainCharacter && this.me.mainCharacter.balance) || 0;
  }
}
</script>