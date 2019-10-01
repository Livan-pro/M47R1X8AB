<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <CharacterItem :data="character" :avatarSize="50" :hideBalance="true" :tap="onTap" />
      <StackLayout class="hr-light m-t-10" />
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
import ImplantsPage from "./Implants.vue";
import InventoryPage from "./Inventory.vue";
import CharacterPage from "./Character.vue";

import me from "@/gql/MainCharacter";
import radioUrl from "@/gql/RadioUrl";
import { MainCharacter_me as MainCharacter } from "@/gql/__generated__/MainCharacter";
import ChangeCharacterPage from "./ChangeCharacter.vue";
import QRCode from "@/components/QRCode.vue";
import StatePage from "./State.vue";
import { CharacterState } from "@/gql/__generated__/globalTypes";
import MessagesPage from "./Messages.vue";
import { openUrl } from "tns-core-modules/utils/utils";

@Component({
  components: { CharacterItem, Menu },
  apollo: {
    me,
    radioUrl,
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
      state: CharacterState.Normal,
      pollution: 0,
      deathTime: null,
      implantsRejectTime: null,
      location: null,
    },
  };
  radioUrl = null;

  onTap(id: number) {
    this.$navigateTo(CharacterPage, { frame: this.$root.currentFrame, props: { id } });
  }

  get items() {
    return [
      { title: `Баланс: ${this.balance}`, open: MoneyPage },
      { title: "Сообщения", open: MessagesPage },
      { title: "Инвентарь", open: InventoryPage },
      { title: "Состояние", open: StatePage },
      { title: "Импланты", open: ImplantsPage, props: { id: this.character.id } },
      { title: "Мой QR-код", modal: QRCode, props: { text: `cbrpnk://c/${this.character.id}` } },
      { title: "Сменить персонажа", open: ChangeCharacterPage },
      {
        title: "Радио",
        action: async () => {
          if (!this.radioUrl) {
            await alert({
              title: "Ошибка",
              message: "Данная функция временно отключена",
              okButtonText: "ОК",
            });
          } else {
            openUrl(this.radioUrl);
          }
        },
      },
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
