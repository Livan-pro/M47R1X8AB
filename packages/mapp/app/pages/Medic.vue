<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <CharacterItem :data="character" :avatarSize="50" :hideBalance="true" class="p-b-10 m-b-10 hr-bottom" />
      <Label v-if="character.state" :text="stateText" :class="color" class="h1 text-center p-b-10 hr-bottom" />
      <Menu :items="items" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";

import ImplantsPage from "@/pages/Implants.vue";
import CharacterItem from "@/components/CharacterItem.vue";
import Menu from "@/components/Menu.vue";
import CreateImplant from "@/modals/CreateImplant.vue";

import MedicalInfoById from "@/gql/MedicalInfoById";
import { MedicalInfoById_character as Character } from "@/gql/__generated__/MedicalInfoById";
import Heal from "@/gql/Heal";
import FixImplants from "@/gql/FixImplants";
import { Profession, CharacterRole, CharacterState } from "../gql/__generated__/globalTypes";
import me from "@/gql/MyRoles";
import { MyRoles_me as Me } from "@/gql/__generated__/MyRoles";
import { stateColor, stateText } from "@/utils";

@Component({
  components: { CharacterItem, Menu },
  apollo: {
    character: {
      ...MedicalInfoById,
      variables(this: MedicPage) {
        return {
          id: this.id,
        };
      },
      skip(this: MedicPage) {
        return this.id < 0;
      },
    },
    me,
  },
})
export default class MedicPage extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;

  character: Character = {
    __typename: "Character",
    id: -1,
    name: "неизвестно",
    own: false,
    avatarUploadedAt: null,
    profession: null,
    professionLevel: null,
    state: null,
    pollution: null,
    implantsRejectTime: null,
  };
  me: Me = {
    __typename: "User",
    roles: [],
    mainCharacter: {
      __typename: "Character",
      id: -1,
      roles: [],
      profession: null,
    },
  };

  get items() {
    const items = [];
    if (this.me.mainCharacter.profession === Profession.Biotechnician)
      items.push({ title: "Список имплантов", open: ImplantsPage, props: { id: this.id } });
    if (this.me.mainCharacter.roles.includes(CharacterRole.Medic)) items.push({ title: "Вылечить", action: () => this.heal() });
    if (this.me.mainCharacter.profession === Profession.Biotechnician)
      items.push(
        { title: "Починить импланты", action: () => this.fixImplants() },
        { title: "Создание импланта", modal: CreateImplant, fullscreen: true, props: { id: this.id } },
      );
    return items;
  }

  async heal() {
    try {
      await this.$apollo.mutate({ ...Heal, variables: { id: this.id } });
      await alert({
        title: "Успех",
        message: `Вы вылечили персонажа ${this.character.name}!`,
        okButtonText: "ОК",
      });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(JSON.stringify(error));
      const message = ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message;
      await alert({
        title: "Ошибка",
        message,
        okButtonText: "ОК",
      });
    }
  }

  async fixImplants() {
    try {
      await this.$apollo.mutate({ ...FixImplants, variables: { id: this.id } });
      await alert({
        title: "Успех",
        message: `Вы починили импланты персонажа ${this.character.name}!`,
        okButtonText: "ОК",
      });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(JSON.stringify(error));
      const message = ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message;
      await alert({
        title: "Ошибка",
        message,
        okButtonText: "ОК",
      });
    }
  }

  get stateText() {
    let text = stateText[this.character.state];
    if (this.character.state === CharacterState.Pollution) text += ` (${this.character.pollution}%)`;
    return text;
  }

  get color() {
    return stateColor[this.character.state];
  }
}
</script>
