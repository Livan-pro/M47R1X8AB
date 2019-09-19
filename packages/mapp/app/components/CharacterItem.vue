<template>
  <StackLayout class="p-b-10" orientation="horizontal" @tap="onTap" @longPress="$emit('longPress')">
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

  onTap() {
    this.$emit("tap", this.data.id);
  }

  getProfessionText() {
    return getProfessionText(this.data.profession, this.data.professionLevel);
  }
}
</script>

<style scoped lang="scss">
.own {
  color: $primary;
}
</style>
