<template>
  <StackLayout class="p-b-10">
    <StackLayout class="hr-light m-b-10" />
    <Label :text="title" dock="left" class="h2" />
    <Label :text="time" dock="right" class="h3 text-right" />
    <Label :text="text" textWrap="true" />
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";

@Component
export default class NewsItem extends Vue {
  title = "Заголовок новости";
  time = "20.06.2019 23:57";
  text = "Здесь должен быть очень длинный, наверное, текст новости.\nА может и не длинный...";
}
</script>

<style scoped>
</style>
