<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Новости" class="h1 text-center hr-bottom" />
        <NewsItem
          v-for="(item, i) in news"
          :key="i"
          :title="item.title"
          :time="item.datetime"
          :text="item.text"
          :attachment="item.attachment"
          class="hr-bottom p-b-10"
        />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import NewsItem from "@/components/NewsItem.vue";

import news from "@/gql/News";
import { News_news as NewsItemType } from "@/gql/__generated__/News";

@Component({
  components: { NewsItem },
  apollo: {
    news,
  },
})
export default class NewsPage extends Vue {
  news: NewsItemType[] = [];
}
</script>

<style scoped></style>
