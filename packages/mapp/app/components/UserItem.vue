<template>
    <StackLayout class="p-b-10" orientation="horizontal">
      <Image :src="avatarUrl" class="m-r-10" :width="avatarSize" :height="avatarSize" />
      <StackLayout>
        <Label :text="name" dock="left" class="h2" />
      </StackLayout>
    </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";

@Component
export default class UserItem extends Vue {
  @Prop({type: String, default: ""}) name!: string;
  @Prop({type: Number, default: -1}) id!: number;
  @Prop({type: Number, default: 100}) avatarSize!: number;

  get avatarUrl() {
    return "https://placehold.it/100x100";
  }
}
</script>

<style scoped>
</style>
