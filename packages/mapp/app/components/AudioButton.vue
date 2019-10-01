<template>
  <Image src="~/assets/images/audioplayer.png" @tap="play" />
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import Player from "~/modals/Player.vue";

@Component
export default class AudioButton extends Vue {
  @Prop({ type: String, default: "" }) src!: string;

  async play() {
    await this.$navigateTo(Player, { frame: this.$root.currentFrame, props: { src: this.src } });
  }
}
</script>
