<template>
  <ScrollView>
    <StackLayout class="p-x-20 p-y-10">
      <Label text="Новости" class="h1 text-center" />
      <NewsItem v-for="i in 10" :key="i" />
      <StackLayout class="hr-light"></StackLayout>
    </StackLayout>
  </ScrollView>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import NewsItem from "@/components/NewsItem.vue";

@Component({
  components: { NewsItem },
})
export default class News extends Vue {
  msg = "Hello World!";
}
</script>

<style scoped>
</style>
