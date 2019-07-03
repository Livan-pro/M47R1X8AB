<template>
  <StackLayout class="p-x-20 p-y-10">
    <UserItem name="My character_name" :avatarSize="50" />
    <StackLayout class="hr-light m-y-10" />
    <ListView for="item in items" @itemTap="onItemTap">
      <v-template>
        <Label class="p-y-20 text-center item-title" :text="item.title" />
      </v-template>
    </ListView>
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import * as appSettings from "tns-core-modules/application-settings";

import UserItem from "@/components/UserItem.vue";
import Login from "@/components/Login.vue";

@Component({
  components: { UserItem },
})
export default class Menu extends Vue {
  items = [
    {title: "Деньги"},
    {title: "Сообщения"},
    {title: "Инвентарь"},
    {title: "Свойства"},
    {title: "Выход", action: this.logout},
  ];

  logout() {
    appSettings.remove("token");
    this.$navigateTo(Login);
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
