<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <CharacterItem :id="characterId" :name="name" :avatarSize="50" />
      <StackLayout class="hr-light m-y-10" />
      <ListView for="item in items" @itemTap="onItemTap">
        <v-template>
          <Label class="p-y-20 text-center item-title" :text="item.title" />
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import * as appSettings from "tns-core-modules/application-settings";
import gql from "graphql-tag";
import { logout } from "@/vue-apollo";

import CharacterItem from "@/components/CharacterItem.vue";
import Login from "./Login.vue";

@Component({
  components: { CharacterItem },
  apollo: {
    me: {
      query: gql`{
        me {
          mainCharacter {
            id
            name
          }
        }
      }`,
      fetchPolicy: "cache-and-network",
    },
  },
})
export default class Menu extends Vue {
  me: any = {};
  items = [
    {title: "Деньги"},
    {title: "Сообщения"},
    {title: "Инвентарь"},
    {title: "Свойства"},
    {title: "Выход", action: logout},
  ];

  get characterId() {
    return (this.me && this.me.mainCharacter && this.me.mainCharacter.id) || -1;
  }

  get name() {
    return (this.me && this.me.mainCharacter && this.me.mainCharacter.name) || "unknown";
  }

  onItemTap({ item }) {
    if (item.action) item.action.call(this);
  }
}
</script>

<style scoped>
.item-title {
  font-size: 24;
}
</style>
