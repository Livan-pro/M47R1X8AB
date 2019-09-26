<template>
  <StackLayout orientation="horizontal" v-on="on">
    <CharacterAvatar :id="data.id" :avatarUploadedAt="data.avatarUploadedAt" :size="avatarSize" />
    <StackLayout>
      <Label :text="data.name" dock="left" class="h2" :class="{ own: data.own }" />
      <Label v-if="data.profession && !hideProfession" :text="getProfessionText()" dock="left" class="h3" />
      <Label v-if="data.balance && !hideBalance" :text="'Баланс: ' + data.balance" dock="left" class="h3" />
    </StackLayout>
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterAvatar from "@/components/CharacterAvatar.vue";
import { getProfessionText } from "@/utils";

@Component({
  components: { CharacterAvatar },
})
export default class CharacterItem extends Vue {
  @Prop({ type: Number, default: 100 }) avatarSize!: number;
  @Prop({ type: Object, default: {} }) data!: {
    name?: string;
    id?: number;
    avatarUploadedAt?: number;
    own?: boolean;
    balance?: number | null;
    profession?: string | null;
    professionLevel?: number | null;
  };
  @Prop({ type: Boolean, default: false }) hideBalance!: boolean;
  @Prop({ type: Boolean, default: false }) hideProfession!: boolean;
  @Prop({ type: Function, default: null }) tap!: ((id: number) => void) | null;
  @Prop({ type: Function, default: null }) longPress!: ((id: number) => void) | null;

  getProfessionText() {
    return getProfessionText(this.data.profession, this.data.professionLevel);
  }

  get on() {
    const on: { tap?: () => void; longPress?: () => void } = {};
    if (this.tap) on.tap = () => this.tap(this.data.id);
    if (this.longPress) on.longPress = () => this.longPress(this.data.id);
    return on;
  }
}
</script>

<style scoped lang="scss">
.own {
  color: $primary;
}
</style>
