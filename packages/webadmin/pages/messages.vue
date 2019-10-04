<template>
  <v-layout justify-center>
    <v-flex sm10 md8 lg6>
      <news-dialog v-model="dialog" :id="newsId" :data="newsData" :type="actionType" />
      <v-card>
        <v-card-title>
          Новости
          <icon-btn class="ml-2" icon="mdi-plus" color="green" tooltip="Создать" @click="createMessage" />
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-search" label="Поиск" single-line hide-details></v-text-field>
        </v-card-title>
        <v-alert v-if="!items.length" type="warning" class="mx-2">
          Новости не найдены
        </v-alert>
        <v-list>
          <template v-for="(item, index) in items">
            <v-divider :key="index"></v-divider>
            <v-list-item :key="item.title">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.date }}</v-list-item-subtitle>
                <v-list-item-subtitle class="text--primary ws-pre-line">
                  {{ item.text }}
                  <img v-if="item.attachment && item.attachment.type === 'Image'" :src="getAttachmentUrl(item.attachment)" class="news-image" />
                  <video
                    v-else-if="item.attachment && item.attachment.type === 'Video'"
                    :src="getAttachmentUrl(item.attachment)"
                    controls
                    class="news-video"
                  />
                  <audio v-else-if="item.attachment && item.attachment.type === 'Audio'" :src="getAttachmentUrl(item.attachment)" controls />
                </v-list-item-subtitle>
              </v-list-item-content>
              <icon-btn icon="mdi-pencil" color="orange" tooltip="Редактировать" @click="updateMessage(item)" />
              <icon-btn icon="mdi-delete" color="red" tooltip="Удалить" @click="deleteMessage(item)" />
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import Chats from "~/gql/Chats";
import Messages from "~/gql/Messages";
import { Chats_chats as Chat } from "~/gql/__generated__/Chats";
import { Messages_messages as Message } from "~/gql/__generated__/Messages";
import IconBtn from "@/components/IconBtn.vue";
import MessageDialog from "@/components/MessageDialog.vue";

@Component({
  components: { IconBtn, MessageDialog },
  apollo: {
    chats: Chats,
    // TODO: self character
  },
  meta: {
    auth: true,
  },
})
export default class MessagesPage extends Vue {
  chats: Chat[] = [];
  search = "";
  dialog = false;

  get normalizedSearch() {
    return this.search.toLowerCase().trim();
  }

  get items() {
    const chats = this.chats.map(item => {
      const opponent = null; // TODO
      if (!item.lastMessage) return item;
      const createdAt = new Date(item.lastMessage.createdAt);
      return { ...item, lastMessage: { ...item.lastMessage, createdAt, createdAtText: createdAt.toLocaleDateString() } };
    });
    if (!this.search) return chats;
    return chats.filter(item => ["par", "text", "date"].some(key => item[key].toLowerCase().includes(this.normalizedSearch))); // TODO
  }
}
</script>

<style lang="sass">
.news-image
  max-height: 500px
.news-video
  width: 100%
</style>
