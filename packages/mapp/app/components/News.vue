<template>
  <ScrollView>
    <StackLayout class="p-x-20 p-y-10">
      <Label text="Новости" class="h1 text-center" />
      <NewsItem v-for="(item, i) in news" :key="i" :title="item.title" :time="item.datetime" :text="item.text" />
      <StackLayout class="hr-light"></StackLayout>
    </StackLayout>
  </ScrollView>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import gql from "graphql-tag";
import NewsItem from "@/components/NewsItem.vue";

@Component({
  components: { NewsItem },
  apollo: {
    news: {
      query: gql`{
        news {
          title
          datetime
          text
        }
      }`,
      fetchPolicy: "cache-and-network",
    },
  },
})
export default class News extends Vue {
  news = [];
}
</script>

<style scoped>
</style>
