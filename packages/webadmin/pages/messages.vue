<template>
  <v-layout justify-space-around>
    <v-col xs12 md6>
      <v-card>
        <select-character-dialog v-model="selectedCharacterId" :characters="characters" />
        <v-card-title>
          Диалоги
          <icon-btn class="ml-2" icon="mdi-plus" color="green" tooltip="Создать" @click="createChat" />
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-search" label="Поиск" single-line hide-details></v-text-field>
        </v-card-title>
        <v-alert v-if="!items.length" type="warning" class="mx-2">
          Нет диалогов
        </v-alert>
        <v-list>
          <template v-for="item in items">
            <v-divider :key="'d' + item.id"></v-divider>
            <v-list-item :key="item.id" :input-value="selectedCharacterId === item.id" @click="selectedCharacterId = item.id">
              <v-list-item-content>
                <v-list-item-title>{{ item.character.name }} (ID{{ item.character.id }})</v-list-item-title>
                <v-list-item-subtitle>{{ item.lastMessage.createdAtText }}</v-list-item-subtitle>
                <v-list-item-subtitle class="text--primary ws-pre-line">
                  {{ item.lastMessage.text }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-col>
    <v-col xs12 md6>
      <Messages :id="selectedCharacterId" />
    </v-col>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

import IconBtn from "@/components/IconBtn.vue";
import Messages from "@/components/Messages.vue";
import SelectCharacterDialog from "@/components/SelectCharacter.vue";

import Chats from "~/gql/Chats";
import { Chats_chats as Chat, Chats_chats_participants as Participant, Chats_chats_lastMessage as Message } from "~/gql/__generated__/Chats";
import me from "~/gql/MyCharacter";
import { MyCharacter_me as Me, MyCharacter_me_mainCharacter as Character } from "~/gql/__generated__/MyCharacter";
import characters from "~/gql/CharactersInfo";
import { CharactersInfo_characters as CharacterInfo } from "~/gql/__generated__/CharactersInfo";

@Component({
  components: { IconBtn, Messages, SelectCharacterDialog },
  apollo: {
    chats: Chats,
    me,
    characters,
  },
  meta: {
    auth: true,
  },
})
export default class MessagesPage extends Vue {
  chats: Chat[] = [];
  me: Me = {
    __typename: "User",
    mainCharacter: null,
  };
  characters: CharacterInfo[] = [];
  search = "";
  selectedCharacterId: boolean | null | number = null;

  get normalizedSearch() {
    return this.search.toLowerCase().trim();
  }

  get items() {
    const chats = this.chats.map(item => {
      const character = item.participants.find(char => char.id !== this.character.id) || item.participants[0];
      if (!item.lastMessage) return { ...item, character };
      const createdAt = new Date(item.lastMessage.createdAt);
      return { ...item, character, lastMessage: { ...item.lastMessage, createdAt, createdAtText: createdAt.toLocaleString() } };
    }) as {
      character: Participant;
      __typename: "Chat";
      id: number;
      participants: Participant[];
      lastMessage: Message & { createdAtText: string } | null;
    }[];
    if (!this.search) return chats;
    return chats.filter(
      item =>
        item.character.name.includes(this.normalizedSearch) ||
        (item.lastMessage &&
          (item.lastMessage.text.includes(this.normalizedSearch) || item.lastMessage.createdAtText.includes(this.normalizedSearch))),
    );
  }

  get character(): Character {
    return (
      this.me.mainCharacter || {
        __typename: "Character",
        id: -1,
        name: "",
        avatarUploadedAt: null,
      }
    );
  }

  createChat() {
    this.selectedCharacterId = false;
  }

  get participants() {
    return (this.chats.find(c => c.id === this.selectedCharacterId) || { participants: [] }).participants;
  }
}
</script>

<style lang="sass">
.news-image
  max-height: 500px
.news-video
  width: 100%
</style>
