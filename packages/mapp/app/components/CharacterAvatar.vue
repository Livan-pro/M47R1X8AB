<template>
  <Image :src="avatarUrl" class="m-r-10" :width="size" :height="size" @tap="$emit('tap')" />
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";

const dataUrl = ENV_DATA_URL || "https://cyberpunk2219.tech/data";

@Component
export default class CharacterItem extends Vue {
  @Prop({type: Number, default: -1}) id!: number;
  @Prop({type: Number}) avatarUploadedAt!: number;
  @Prop({type: Number, default: 100}) size!: number;

  get avatarUrl() {
    if (this.id < 0 || !this.avatarUploadedAt) return `${dataUrl}/avatar/no-avatar.png`;
    else return `${dataUrl}/avatar/${this.id}_${Math.floor(this.avatarUploadedAt / 1000)}.png`;
  }
}
</script>

<style scoped>
</style>
