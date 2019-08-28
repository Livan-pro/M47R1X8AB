<template>
  <StackLayout class="p-b-10">
    <StackLayout class="hr-light m-b-10" />
    <Label :text="title" dock="left" class="h2" />
    <Label :text="formattedTime" dock="right" class="h3 text-right" />
    <Label :text="text" textWrap="true" />
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";

@Component
export default class NewsItem extends Vue {
  @Prop({ type: String, default: "" }) title!: string;
  @Prop() time!: Date | string;
  @Prop({ type: String, default: "" }) text!: string;

  get formattedTime() {
    const d = new Date(this.time);
    return (
      `${d
        .getDate()
        .toString()
        .padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()} ` +
      `${d
        .getHours()
        .toString()
        .padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
  }
}
</script>

<style scoped></style>
