<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Импланты" class="h1 text-center" />
        <StackLayout class="hr-light" />
        <Label :text="stateText" class="h2 text-center" :class="{ rejected }" />
        <template v-for="(item, i) in implants">
          <StackLayout :key="'hr-' + i" class="hr-light m-b-10" />
          <ImplantItem :key="i" :data="item" />
        </template>
        <StackLayout class="hr-light" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import ImplantItem from "@/components/ImplantItem.vue";

import implants from "@/gql/Implants";
import me from "@/gql/ImplantsRejectTime";
import { Implants_implants as Implant } from "@/gql/__generated__/Implants";
import { ImplantsRejectTime_me as Me } from "@/gql/__generated__/ImplantsRejectTime";

@Component({
  components: { ImplantItem },
  apollo: {
    implants,
    me,
  },
})
export default class ImplantsPage extends Vue {
  implants: Implant[] = [];
  me: Me = {
    __typename: "User",
    mainCharacter: {
      __typename: "Character",
      implantsRejectTime: null,
    },
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
    return this.me.mainCharacter.implantsRejectTime;
  }

  get stateText() {
    return this.rejected ? "Импланты отторглись" : `Отторжение через: ${this.timerText}`;
  }
}
</script>

<style scoped lang="scss">
.rejected {
  color: $red;
}
</style>
