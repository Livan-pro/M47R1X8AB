<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <Label text="Сообщения" class="h1 text-center hr-bottom" />
      <GridLayout class="m-b-5" columns="*,auto" rows="auto">
        <Button row="0" col="0" text="Новый диалог" @tap="newDialog" />
        <Button row="0" col="1" class="m-l-5" text="Рассылка" @tap="broadcast" />
      </GridLayout>
      <StackLayout class="hr-light" />
      <ListView for="item in chats" height="100%" @itemTap="onItemTap">
        <v-template>
          <ChatItem :chat="item" class="hr-bottom p-y-10" />
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import ChatItem from "@/components/ChatItem.vue";
import MessagesPage from "./Messages.vue";
import SelectCharacter from "@/pages/Characters.vue";
import BroadcastMessageModal from "@/modals/BroadcastMessage.vue";

import chats from "@/gql/Chats";
import { Chats_chats as Chat } from "@/gql/__generated__/Chats";

@Component({
  components: { ChatItem },
  apollo: {
    chats,
  },
})
export default class ChatsPage extends Vue {
  chats: Chat[] = [];

  onItemTap({ item }: { item: Chat }) {
    this.$navigateTo(MessagesPage, { frame: this.$root.currentFrame, props: { id: item.id } });
  }

  async newDialog() {
    const id = await this.$showModal(SelectCharacter, { fullscreen: true, props: { modal: true } });
    if (typeof id !== "number") return;
    this.$navigateTo(MessagesPage, { frame: this.$root.currentFrame, props: { id } });
  }

  async broadcast() {
    await this.$showModal(BroadcastMessageModal, { fullscreen: true });
  }
}
</script>

<style scoped></style>
