<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <CharacterItem :data="character" :avatarSize="50" :hideBalance="true" />
      <StackLayout class="hr-light m-y-10" />
      <Menu :items="items" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { logout } from "@/vue-apollo";

import CharacterItem from "@/components/CharacterItem.vue";
import Menu from "@/components/Menu.vue";
import MoneyPage from "./Money.vue";

import me from "@/gql/MainCharacter";
import { MainCharacter_me as MainCharacter } from "@/gql/__generated__/MainCharacter";
import ChangeCharacterPage from "./ChangeCharacter.vue";
import QRCode from "@/components/QRCode.vue";

@Component({
  components: { CharacterItem, Menu },
  apollo: {
    me,
  },
})
export default class MenuPage extends Vue {
  me: MainCharacter = {
    __typename: "User",
    mainCharacter: {
      __typename: "Character",
      id: -1,
      name: "неизвестно",
      avatarUploadedAt: null,
      balance: 0,
      profession: null,
      professionLevel: null,
    },
  };
  get items() {
    return [
      { title: `Баланс: ${this.balance}`, open: MoneyPage },
      { title: "Сообщения" },
      { title: "Инвентарь" },
      { title: "Свойства" },
      { title: "Мой QR-код", modal: QRCode, props: { text: `cbrpnk://c/${this.character.id}` } },
      { title: "Сменить персонажа", open: ChangeCharacterPage },
      { title: "Выход", action: logout },
    ];
  }

  get character() {
    return this.me.mainCharacter;
  }

  get balance() {
    return this.character.balance;
  }
}
</script>
