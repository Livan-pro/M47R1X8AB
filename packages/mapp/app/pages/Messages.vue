<template>
  <Page actionBarHidden="true">
    <DockLayout stretchLastChild="true" class="p-x-20 p-y-10">
      <GridLayout columns="*,auto" rows="auto" dock="bottom" class="m-t-10">
        <TextField
          ref="input"
          v-model="newMessage.text"
          col="0"
          row="0"
          class="m-r-10"
          hint="Сообщение"
          returnKeyType="done"
          @returnPress="sendMessage"
        />
        <LoadingButton col="1" row="0" width="50" :text="'\uf1d8'" class="fas" :loading="loadingNew" @tap="sendMessage" />
      </GridLayout>
      <ListView ref="list" for="item in items" height="100%" class="hr-bottom">
        <v-template>
          <MessageItem :message="item.message" :character="item.character" class="hr-bottom p-y-10" :class="{ last: item.last }" />
        </v-template>
      </ListView>
    </DockLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { ListView } from "tns-core-modules/ui/list-view";
import { TextField } from "tns-core-modules/ui/text-field";

import MessageItem from "@/components/MessageItem.vue";
import LoadingButton from "@/components/LoadingButton.vue";

import Messages from "@/gql/Messages";
import ChatById from "@/gql/Chat";
import SendMessage from "@/gql/SendMessage";
import { Messages_messages as Message, Messages as MessagesQuery } from "@/gql/__generated__/Messages";
import { Chat_chat as Chat } from "@/gql/__generated__/Chat";

@Component({
  components: { MessageItem, LoadingButton },
  apollo: {
    messages: {
      ...Messages,
      variables(this: MessagesPage) {
        return {
          id: this.id,
        };
      },
      skip(this: MessagesPage) {
        return this.id < 0;
      },
      subscribeToMore: {
        ...Messages.subscribeToMore,
        variables(this: MessagesPage) {
          return {
            id: this.id,
          };
        },
      },
    },
    chat: {
      ...ChatById,
      variables(this: MessagesPage) {
        return {
          id: this.id,
        };
      },
      skip(this: MessagesPage) {
        return this.id < 0;
      },
    },
  },
})
export default class MessagesPage extends Vue {
  @Prop({ type: Number, default: -1 }) id: number;
  messages: Message[] = [];
  chat: Chat = {
    __typename: "Chat",
    id: -1,
    lastMessage: null,
    participants: [],
  };
  lastLength = 0;
  loading = false;
  loadingNew = false;

  newMessage = {
    text: "",
  };

  created() {
    this.$root.currentChat = this.id;
  }

  beforeDestroy() {
    this.$root.currentChat = null;
  }

  @Watch("items")
  onMessagesUpdate(items) {
    console.log("onMessagesUpdate", items.length);
    if (this.lastLength === items.length) return;
    setTimeout(() => {
      if (this.lastLength === 0) ((this.$refs.list as unknown) as { nativeView: ListView }).nativeView.scrollToIndex(items.length);
      else ((this.$refs.list as unknown) as { nativeView: ListView }).nativeView.scrollToIndexAnimated(items.length);
      this.lastLength = items.length;
    }, 0);
  }

  get items() {
    return this.messages.map((message, i) => ({
      message,
      character: this.chat.participants.find(c => c.id === message.fromId) || {
        __typename: "Character",
        id: -1,
        name: "",
        avatarUploadedAt: 0,
        own: false,
      },
      first: i === 0,
      last: i === this.messages.length - 1,
    }));
  }

  async sendMessage() {
    this.loadingNew = true;
    ((this.$refs.input as unknown) as { nativeView: TextField }).nativeView.dismissSoftInput();
    await this.$apollo.mutate({ ...SendMessage, variables: { id: this.id, message: this.newMessage } });
    this.newMessage = { text: "" };
    this.loadingNew = false;
  }

  async fetchMore() {
    if (this.messages.length < 1) return;
    this.loading = true;
    await this.$apollo.queries.messages.fetchMore({
      variables: {
        id: this.id,
        beforeId: this.messages[0].id,
      },
      updateQuery: (prev: MessagesQuery, { fetchMoreResult: { messages } }: { fetchMoreResult: MessagesQuery }) => {
        for (const m of messages) {
          const idx = prev.messages.findIndex((msg): boolean => msg.id === m.id);
          if (idx < 0) prev.messages.unshift(m);
        }
        return prev;
      },
    });
    this.loading = false;
  }
}
</script>

<style scoped>
.last {
  margin-bottom: 0;
}
</style>
