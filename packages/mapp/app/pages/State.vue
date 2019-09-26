<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <CharacterItem :data="character" :avatarSize="50" :hideBalance="true" @tap="onTap" />
      <StackLayout class="hr-light m-y-10" />
      <Label :text="stateText" :class="color" class="h1 text-center m-y-10" />
      <Label v-if="isDeathTimeVisible" :text="deathTimeText" class="h2 text-center" />
      <Label v-if="isTimerVisible" :text="timerText" class="h2 text-center" />
      <StackLayout class="hr-light m-y-20" />
      <Menu :items="items" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";

import CharacterItem from "@/components/CharacterItem.vue";
import QRCode from "@/components/QRCode.vue";
import Menu from "@/components/Menu.vue";
import ChangeCharacterPage from "./ChangeCharacter.vue";

import me from "@/gql/MyStateExtended";
import { MyStateExtended_me as Me } from "@/gql/__generated__/MyStateExtended";
import { CharacterState, Profession } from "@/gql/__generated__/globalTypes";
import { logout } from "@/vue-apollo";
import { month } from "@/utils";
import CharacterPage from "./Character.vue";
import ConfirmSuicide from "@/modals/ConfirmSuicide.vue";

const states = Object.freeze({
  [CharacterState.Normal]: "Норма",
  [CharacterState.Pollution]: "Загрязнение",
  [CharacterState.SevereWound]: "Тяжёлое ранение",
  [CharacterState.Death]: "Смерть",
});

const colors = Object.freeze({
  [CharacterState.Normal]: "primary",
  [CharacterState.Pollution]: "orange",
  [CharacterState.SevereWound]: "red",
  [CharacterState.Death]: "red",
});

@Component({
  components: { CharacterItem, Menu },
  apollo: {
    me,
  },
})
export default class StatePage extends Vue {
  me: Me = {
    __typename: "User",
    mainCharacter: {
      __typename: "Character",
      id: -1,
      name: "неизвестно",
      avatarUploadedAt: 0,
      state: CharacterState.Normal,
      pollution: 0,
      deathTime: "",
      profession: Profession.None,
      professionLevel: 0,
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
    if (!this.isTimerVisible) return;

    const ms = this.deathTimestamp - Date.now();
    let s = Math.floor(ms / 1000);
    let m = Math.floor(s / 60);
    s -= m * 60;
    let h = Math.floor(m / 60);
    m -= h * 60;
    this.timerText = (h > 0 ? `${h.toString().padStart(2, "0")}:` : "") + `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  async suicide() {
    await this.$showModal(ConfirmSuicide, { props: { character: this.character } });
  }

  onTap(id: number) {
    this.$navigateTo(CharacterPage, { frame: this.$root.currentFrame, props: { id } });
  }

  get items() {
    return [
      { title: "Мой QR-код", modal: QRCode, props: { text: `cbrpnk://c/${this.character.id}` } },
      { title: "Суицид", action: () => this.suicide(), disabled: this.character.state === CharacterState.Death },
      { title: "Сменить персонажа", open: ChangeCharacterPage },
      { title: "Выход", action: logout },
      // TODO: conditional items
    ];
  }

  get character() {
    return this.me.mainCharacter;
  }

  get stateText() {
    let text = states[this.character.state];
    if (this.character.state === CharacterState.Pollution) text += ` (${this.character.pollution}%)`;
    return text;
  }

  get isDeathTimeVisible() {
    return this.character.state === CharacterState.Death;
  }

  get isTimerVisible() {
    return this.character.state === CharacterState.SevereWound;
  }

  get deathTime() {
    return new Date(this.character.deathTime);
  }

  get deathTimeText() {
    const d = this.deathTime;
    return `${d.getDate()} ${month[d.getMonth()]} в ${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  get deathTimestamp() {
    return new Date(this.character.deathTime).getTime();
  }

  get color() {
    return colors[this.character.state];
  }

  get isSuicideVisible() {
    return this.character.state !== CharacterState.Death;
  }
}
</script>

<style scoped lang="scss">
.own {
  color: $primary;
}

.primary {
  color: $primary;
}

.orange {
  color: $orange;
}

.red {
  color: $red;
}
</style>
