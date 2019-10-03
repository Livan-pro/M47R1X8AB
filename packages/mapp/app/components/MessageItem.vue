<template>
  <StackLayout orientation="horizontal">
    <CharacterAvatar :id="character.id" :avatarUploadedAt="character.avatarUploadedAt" :size="50" />
    <StackLayout>
      <Label :text="message.text" dock="left" class="h3" textWrap="true" />
    </StackLayout>
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterAvatar from "@/components/CharacterAvatar.vue";

import { Messages_messages as Message } from "@/gql/__generated__/Messages";
import { Chats_chats_participants as Character } from "@/gql/__generated__/Chats";

@Component({
  components: { CharacterAvatar },
})
export default class MessageItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      __typename: "Message",
      createdAt: "",
      fromId: -1,
      toId: -1,
      text: "",
    }),
  })
  message!: Message;
  @Prop({
    type: Object,
    default: () => ({
      __typename: "Character",
      id: -1,
      name: "",
      avatarUploadedAt: 0,
      own: false,
    }),
  })
  character!: Character;
}
</script>

<style scoped lang="scss"></style>
