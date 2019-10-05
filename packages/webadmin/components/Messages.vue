<template>
  <v-card>
    <v-card-title>
      Сообщения
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-search" label="Поиск" single-line hide-details></v-text-field>
    </v-card-title>
    <v-alert v-if="!items.length" type="warning" class="mx-2">
      Нет сообщений
    </v-alert>
    <v-list>
      <template v-for="item in items">
        <v-divider :key="'d' + item.id"></v-divider>
        <v-list-item :key="item.id">
          <v-list-item-content>
            <v-list-item-title>{{ item.character.name }} (ID{{ item.character.id }})</v-list-item-title>
            <v-list-item-subtitle>{{ item.message.createdAtText }}</v-list-item-subtitle>
            <v-list-item-subtitle class="text--primary ws-pre-line" style="white-space:pre">
              {{ item.message.text }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <div class="pa-2 d-flex" style="flex-direction: row; align-items: center">
      <v-textarea v-model="newMessage" label="Сообщение" hide-details />
      <v-btn color="primary" :loading="loading" @click="sendMessage">Отправить</v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import MessagesQuery from "~/gql/Messages";
import { Messages_messages as Message } from "~/gql/__generated__/Messages";
import SendMessage from "~/gql/SendMessage";
import ChatById from "~/gql/Chat";
import { Chat_chat as Chat, Chat_chat_participants as Participant } from "~/gql/__generated__/Chat";

@Component({
  apollo: {
    messages: {
      ...MessagesQuery,
      variables(this: MessagesPage) {
        return {
          id: this.id,
        };
      },
      skip(this: MessagesPage) {
        return typeof this.id !== "number" || this.id < 0;
      },
      /*subscribeToMore: {
        ...MessagesQuery.subscribeToMore,
        variables(this: MessagesPage) {
          return {
            id: this.id,
          };
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,*/
    },
    chat: {
      ...ChatById,
      variables(this: MessagesPage) {
        return {
          id: this.id,
        };
      },
      skip(this: MessagesPage) {
        return typeof this.id !== "number" || this.id < 0;
      },
    },
  },
})
export default class MessagesPage extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: Array, default: () => [] }) participants!: Participant[];
  messages: Message[] = [];
  chat: Chat = { __typename: "Chat", id: -1, participants: [], lastMessage: null };
  loading = false;
  newMessage = "";
  search = "";

  get normalizedSearch() {
    return this.search.toLowerCase().trim();
  }

  get items() {
    const messages = this.messages.map(message => {
      const createdAt = new Date(message.createdAt);
      return {
        id: message.id,
        message: { ...message, createdAt, createdAtText: createdAt.toLocaleString() },
        character: this.chat.participants.find(c => c.id === message.fromId) || {
          __typename: "Character",
          id: -1,
          name: "",
          avatarUploadedAt: 0,
          own: false,
        },
      };
    });
    if (!this.search) return messages;
    return messages.filter(
      item =>
        item.character.name.includes(this.normalizedSearch) ||
        (item.message.text.includes(this.normalizedSearch) || item.message.createdAtText.includes(this.normalizedSearch)),
    );
  }

  async sendMessage() {
    this.loading = true;
    try {
      await this.$apollo.mutate({ ...SendMessage, variables: { id: this.id, message: { text: this.newMessage } } });
      this.newMessage = "";
    } catch (error) {
      this.$root.$emit("snackbar", {
        text: ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message,
        color: "error",
      });
    }
    this.loading = false;
  }
}
</script>
