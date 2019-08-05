<template>
  <v-layout justify-center>
    <v-flex sm10 md8 lg6>
      <news-dialog v-model="dialog" :id="newsId" :data="newsData" :type="actionType" />
      <v-card>
        <v-card-title>
          Новости
          <icon-btn class="ml-2" icon="mdi-plus" color="green" tooltip="Создать" @click="createNews" />
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
                <v-list-item-subtitle class="text--primary ws-pre-line">{{ item.text }}</v-list-item-subtitle>
              </v-list-item-content>
              <icon-btn icon="mdi-pencil" color="orange" tooltip="Редактировать" @click="updateNews(item)" />
              <icon-btn icon="mdi-delete" color="red" tooltip="Удалить" @click="deleteNews(item)" />
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import news from "~/gql/News";
import me from "~/gql/MyRoles";
import { News_news as News } from "~/gql/__generated__/News";
import { MyRoles_me as Me } from "~/gql/__generated__/MyRoles";
import { Role } from "../gql/__generated__/globalTypes";
import IconBtn from "@/components/IconBtn.vue";
import NewsDialog from "@/components/NewsDialog.vue";

@Component({
  components: { IconBtn, NewsDialog },
  apollo: {
    news,
    me,
  },
  meta: {
    auth: true,
  },
})
export default class NewsPage extends Vue {
  news: News[] = [];
  me: Me = { __typename: "User", roles: [] };
  search = "";
  actionType = "create";
  newsId: number = -1;
  newsData: News | null = null;
  dialog = false;

  get normalizedSearch() {
    return this.search.toLowerCase().trim();
  }

  get items() {
    console.log(this.search);
    const news = this.news.map(item => {
      const datetime = new Date(item.datetime);
      return { ...item, datetime, date: datetime.toLocaleDateString() };
    });
    if (!this.search) return news;
    return news.filter(item => ["title", "text", "date"].some(key => item[key].toLowerCase().includes(this.normalizedSearch)));
  }

  get isSuperAdmin() {
    return this.me.roles && this.me.roles.includes(Role.SuperAdmin);
  }

  createNews() {
    this.actionType = "create";
    this.dialog = true;
  }

  updateNews(item: News) {
    this.actionType = "update";
    this.newsId = item.id;
    this.newsData = item;
    this.dialog = true;
  }

  deleteNews(item: News) {
    this.actionType = "delete";
    this.newsId = item.id;
    this.newsData = item;
    this.dialog = true;
  }
}
</script>

<style lang="sass">
tr td:last-child
  width: 1%
  white-space: nowrap
</style>
