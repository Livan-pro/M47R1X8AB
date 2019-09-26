<template>
  <Image :src="avatarUrl" class="m-r-10" :width="size" :height="size" v-on="on" />
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { dataUrl } from "@/utils";

@Component
export default class CharacterAvatar extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: Number }) avatarUploadedAt!: number;
  @Prop({ type: Number, default: 100 }) size!: number;
  @Prop({ type: Function, default: null }) tap!: ((id: number) => void) | null;
  @Prop({ type: Function, default: null }) longPress!: ((id: number) => void) | null;

  get avatarUrl() {
    if (this.id < 0 || !this.avatarUploadedAt) return `${dataUrl}/avatar/no-avatar.png`;
    else return `${dataUrl}/avatar/${this.id}_${Math.floor(this.avatarUploadedAt / 1000)}.png`;
  }

  get on() {
    const on: { tap?: () => void; longPress?: () => void } = {};
    if (this.tap) on.tap = () => this.tap(this.id);
    if (this.longPress) on.longPress = () => this.longPress(this.id);
    return on;
  }
}
</script>

<style scoped></style>
