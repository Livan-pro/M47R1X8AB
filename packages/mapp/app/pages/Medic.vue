<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <CharacterItem :data="character" :avatarSize="50" :hideBalance="true" />
      <StackLayout class="hr-light m-y-10" />
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

import CharacterById from "@/gql/CharacterById";
import { CharacterById_character as Character } from "@/gql/__generated__/CharacterById";
import Heal from "@/gql/Heal";
import FixImplants from "@/gql/FixImplants";

@Component({
  components: { CharacterItem, Menu },
  apollo: {
    character: {
      ...CharacterById,
      variables() {
        return {
          id: (this as MedicPage).id,
        };
      },
    },
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
    location: null,
    implantsRejectTime: null,
    properties: [],
  };

  get items() {
    return [
      { title: "Список имплантов", open: ImplantsPage, props: { id: this.id } },
      { title: "Вылечить", action: () => this.heal() },
      { title: "Починить импланты", action: () => this.fixImplants() },
      { title: "Создание импланта", modal: CreateImplant, props: { id: this.id } },
    ];
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
}
</script>
