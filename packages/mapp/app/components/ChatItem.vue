<template>
  <StackLayout orientation="horizontal">
    <CharacterAvatar :id="chat.id" :avatarUploadedAt="avatarUploadedAt" :size="avatarSize" />
    <StackLayout>
      <Label :text="name" dock="left" class="h2" />
      <Label :text="text" dock="left" class="h3" />
    </StackLayout>
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterAvatar from "@/components/CharacterAvatar.vue";

import { Chats_chats as Chat, Chats_chats_participants as Character } from "@/gql/__generated__/Chats";

@Component({
  components: { CharacterAvatar },
})
export default class ChatItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      __typename: "Chat",
      id: 0,
      participants: [],
      lastMessage: null,
    }),
  })
  chat!: Chat;

  avatarSize = 50;

  get name() {
    return this.character.name;
  }

  get text() {
    return (this.chat.lastMessage || { text: "" }).text;
  }

  get character(): Character {
    return this.chat.participants.find(c => c.id === this.chat.id) || { __typename: "Character", id: -1, name: "", avatarUploadedAt: 0, own: false };
  }

  get avatarUploadedAt() {
    return this.character.avatarUploadedAt;
  }
}
</script>

<style scoped lang="scss"></style>
