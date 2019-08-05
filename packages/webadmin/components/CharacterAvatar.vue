<template>
  <img :src="avatarUrl" class="m-r-10" :style="{ width: size + 'px', height: size + 'px' }" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

const dataUrl = process.env.NODE_ENV === "production" ? "https://cyberpunk2219.tech/data" : process.env.DATA_URL;

@Component
export default class CharacterAvatar extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: Number }) avatarUploadedAt!: number;
  @Prop({ type: Number, default: 100 }) size!: number;

  get avatarUrl() {
    if (this.id < 0 || !this.avatarUploadedAt) return `${dataUrl}/avatar/no-avatar.png`;
    else return `${dataUrl}/avatar/${this.id}_${Math.floor(this.avatarUploadedAt / 1000)}.png`;
  }
}
</script>

<style scoped></style>
