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
export default class CharacterItem extends Vue {
  @Prop({type: String, default: ""}) name!: string;
  @Prop({type: Number, default: -1}) id!: number;
  @Prop({type: Number, default: 100}) avatarSize!: number;

  get avatarUrl() {
    if (this.id < 0) return "https://cyberpunk2219.tech/data/avatar/no-avatar.png";
    else return `https://cyberpunk2219.tech/data/avatar/${this.id}.png`; // "https://placehold.it/100x100";
  }
}
</script>

<style scoped>
</style>
