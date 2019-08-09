<template>
  <StackLayout class="p-b-10" orientation="horizontal" @tap="onTap">
    <CharacterAvatar :id="id" :avatar-uploaded-at="avatarUploadedAt" :size="avatarSize" />
    <StackLayout>
      <Label :text="name" dock="left" class="h2" :class="{ own }" />
    </StackLayout>
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import Character from "@/pages/Character.vue";
import CharacterAvatar from "@/components/CharacterAvatar.vue";

@Component({
  components: { CharacterAvatar },
})
export default class CharacterItem extends Vue {
  @Prop({ type: String, default: "" }) name!: string;
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: Number }) avatarUploadedAt!: number;
  @Prop({ type: Boolean, default: false }) own!: boolean;
  @Prop({ type: Number, default: 100 }) avatarSize!: number;

  onTap() {
    let navigate = true;
    this.$emit("tap", {
      id: this.id,
      preventDefault: () => (navigate = false),
    });
    if (!navigate) return;
    this.$navigateTo(Character, { frame: this.$root.currentFrame, props: { id: this.id } });
  }
}
</script>

<style scoped lang="scss">
.own {
  color: $primary;
}
</style>
