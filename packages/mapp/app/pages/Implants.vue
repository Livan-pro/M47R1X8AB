<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <CharacterItem :data="character" :avatarSize="50" :hideBalance="true" />
      <StackLayout class="hr-light m-y-10" />
      <Label text="Импланты" class="h1 text-center" />
      <StackLayout class="hr-light" />
      <Label v-if="isStateVisible" :text="stateText" class="h2 text-center hr-bottom" :class="{ rejected }" />
      <ListView for="item in implants" height="100%">
        <v-template>
          <ImplantItem :data="item" :rejected="rejected" class="hr-bottom p-y-10" />
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "@/components/CharacterItem.vue";
import ImplantItem from "@/components/ImplantItem.vue";

import implants from "@/gql/Implants";
import CharacterInfoById from "@/gql/CharacterInfoById";
import ImplantsRejectTimeById from "@/gql/ImplantsRejectTimeById";
import { Implants_implants as Implant } from "@/gql/__generated__/Implants";
import { CharacterInfoById_character as Character } from "@/gql/__generated__/CharacterInfoById";
import { ImplantsRejectTimeById_rejectTime as RejectTime } from "@/gql/__generated__/ImplantsRejectTimeById";

@Component({
  components: { CharacterItem, ImplantItem },
  apollo: {
    implants: {
      ...implants,
      variables(this: ImplantsPage) {
        return {
          id: this.id,
        };
      },
      skip(this: ImplantsPage) {
        return this.id < 0;
      },
    },
    character: {
      ...CharacterInfoById,
      variables(this: ImplantsPage) {
        return {
          id: this.id,
        };
      },
      skip(this: ImplantsPage) {
        return this.id < 0;
      },
    },
    rejectTime: {
      ...ImplantsRejectTimeById,
      variables(this: ImplantsPage) {
        return {
          id: this.id,
        };
      },
      skip(this: ImplantsPage) {
        return this.id < 0;
      },
    },
  },
})
export default class ImplantsPage extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  implants: Implant[] = [];
  character: Character = {
    __typename: "Character",
    id: -1,
    name: "неизвестно",
    own: false,
    avatarUploadedAt: null,
    profession: null,
    professionLevel: null,
  };
  rejectTime: RejectTime = {
    __typename: "Character",
    id: -1,
    implantsRejectTime: null,
  };

  timerText = "00:00";
  intervalId = -1;

  created() {
    this.updateTime();
    this.intervalId = (setInterval(() => this.updateTime(), 1000) as unknown) as number;
  }

  beforeDestroy() {
    clearInterval(this.intervalId);
  }

  updateTime() {
    if (this.rejected) return;

    const ms = this.implantsRejectTime - Date.now();
    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60);
    s -= m * 60;
    let h = Math.floor(m / 60);
    m -= h * 60;
    this.timerText = (h > 0 ? `${h.toString().padStart(2, "0")}:` : "") + `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  get rejected() {
    return !this.implantsRejectTime;
  }

  get implantsRejectTime() {
    return this.rejectTime.implantsRejectTime;
  }

  get stateText() {
    return this.rejected ? "Импланты отторглись" : `Отторжение через: ${this.timerText}`;
  }

  get isStateVisible() {
    return this.implants.length > 0 && this.implants.some(implant => !implant.quality);
  }
}
</script>

<style scoped lang="scss">
.rejected {
  color: $red;
}
</style>
