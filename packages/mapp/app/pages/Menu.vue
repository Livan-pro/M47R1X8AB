<template>
  <Page action-bar-hidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <CharacterItem :id="characterId" :avatar-uploaded-at="avatarUploadedAt" :name="name" :avatar-size="50" />
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

@Component({
  components: { CharacterItem, Menu },
  apollo: {
    me,
  },
})
export default class MenuPage extends Vue {
  me: MainCharacter | {} = {};
  get items() {
    return [
      { title: `Баланс: ${this.balance}`, open: MoneyPage },
      { title: "Сообщения" },
      { title: "Инвентарь" },
      { title: "Свойства" },
      { title: "Выход", action: logout },
    ];
  }

  get characterId() {
    const me = this.me as MainCharacter;
    return (me && me.mainCharacter && me.mainCharacter.id) || -1;
  }

  get balance() {
    const me = this.me as MainCharacter;
    return (me && me.mainCharacter && me.mainCharacter.balance) || 0;
  }

  get avatarUploadedAt() {
    const me = this.me as MainCharacter;
    return (me && me.mainCharacter && me.mainCharacter.avatarUploadedAt) || null;
  }

  get name() {
    const me = this.me as MainCharacter;
    return (me && me.mainCharacter && me.mainCharacter.name) || "unknown";
  }
}
</script>
