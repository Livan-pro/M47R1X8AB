<template>
  <Page ref="page" actionBarHidden="true" :class="`${background}-bg`">
    <VideoPlayer
      ref="video"
      :controls="true"
      :autoplay="true"
      :src="src"
      :height="height"
      :width="width"
      :fill="true"
      @playbackReady="onPlaybackReady"
    />
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { View, Size } from "tns-core-modules/ui/core/view/view";
import { Video } from "nativescript-videoplayer";
import * as app from "tns-core-modules/application";

@Component
export default class Player extends Vue {
  @Prop({ type: String, default: "" }) src!: string;
  videoSize: Size | null = null;
  pageSize: Size | null = null;
  height: number | string = "100%";
  width: number | string = "100%";
  background = "black";

  created() {
    app.on(app.orientationChangedEvent, this.onOrientationChange);
  }

  beforeDestroy() {
    app.off(app.orientationChangedEvent, this.onOrientationChange);
  }

  resize() {
    this.pageSize = ((this.$refs.page as unknown) as { nativeView: View }).nativeView.getActualSize();
    const scale = Math.min(this.pageSize.width / this.videoSize.width, this.pageSize.height / this.videoSize.height);
    if (this.videoSize.width === 0 && this.videoSize.height === 0) {
      this.background = "audio";
      this.height = this.pageSize.height;
      this.width = this.pageSize.width;
    } else {
      this.background = "video";
      this.height = this.videoSize.height * scale;
      this.width = this.videoSize.width * scale;
    }
  }

  onPlaybackReady() {
    this.videoSize = (((this.$refs.video as unknown) as { nativeView: Video }).nativeView as { getVideoSize: () => Size }).getVideoSize();
    console.log("videoSize", this.videoSize.width, this.videoSize.height);
    this.resize();
  }

  onOrientationChange() {
    setTimeout(() => {
      if (!this.videoSize) return;
      this.resize();
    }, 100);
  }
}
</script>

<style lang="scss" scoped>
.video-bg {
  background: black;
}

.audio-bg {
  background-color: $primary-darker;
  background-image: url("~/assets/images/audioplayer.png");
  background-size: contain;
}
</style>
