<template>
  <StackLayout>
    <Label :text="title" dock="left" class="h2" />
    <Label :text="formattedTime" dock="right" class="h3 text-right" />
    <Label v-if="text.length > 0" :text="text" textWrap="true" />
    <Image v-if="attachment && attachment.type === 'Image'" :src="getAttachmentUrl(attachment)" class="m-t-10" />
    <VideoButton v-if="attachment && attachment.type === 'Video'" :src="getAttachmentUrl(attachment)" class="m-t-10" />
    <AudioButton v-if="attachment && attachment.type === 'Audio'" :src="getAttachmentUrl(attachment)" class="m-t-10" />
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { getAttachmentUrl } from "@/utils";
import VideoButton from "@/components/VideoButton.vue";
import AudioButton from "@/components/AudioButton.vue";

@Component({
  components: { VideoButton, AudioButton },
})
export default class NewsItem extends Vue {
  @Prop({ type: String, default: "" }) title!: string;
  @Prop() time!: Date | string;
  @Prop({ type: String, default: "" }) text!: string;
  @Prop({ type: Object, default: null }) attachment!: object | null;

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

  getAttachmentUrl = getAttachmentUrl;
}
</script>

<style scoped></style>
