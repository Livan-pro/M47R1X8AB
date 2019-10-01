<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Создание импланта" dock="left" class="h2" />
        <TextField v-model="name" hint="Название" returnKeyType="done" />
        <ListPicker v-model="typeIndex" :items="types" />
        <LoadingButton :loading="loading" text="Создать" @tap="doCreate" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import LoadingButton from "@/components/LoadingButton.vue";

import CharacterById from "@/gql/CharacterById";
import CreateImplant from "@/gql/CreateImplant";
import { CharacterById_character as Character } from "@/gql/__generated__/CharacterById";
import { implantTypes } from "@/utils";

@Component({
  components: { LoadingButton },
  apollo: {
    character: {
      ...CharacterById,
      variables(this: CreateImplantModal) {
        return {
          id: this.id,
        };
      },
      skip(this: CreateImplantModal) {
        return this.id < 0;
      },
    },
  },
})
export default class CreateImplantModal extends Vue {
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
  loading = false;
  name = "";
  typeIndex = 0;

  async doCreate() {
    if (this.name.length < 1) {
      await alert({
        title: "Ошибка",
        message: "Вы должны ввести название импланта!",
        okButtonText: "ОК",
      });
      return;
    }
    this.loading = true;
    try {
      await this.$apollo.mutate({
        ...CreateImplant,
        variables: {
          data: {
            characterId: this.id,
            name: this.name,
            type: this.type,
          },
        },
      });
      await alert({
        title: "Успех",
        message: `Вы создали имплант для персонажа ${(this.character as Character).name}`,
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
    this.loading = false;
    this.$modal.close();
  }

  get types() {
    return Object.values(implantTypes);
  }

  get type() {
    return Object.keys(implantTypes)[this.typeIndex];
  }
}
</script>

<style scoped>
button {
  margin: 16px 0;
}
</style>
