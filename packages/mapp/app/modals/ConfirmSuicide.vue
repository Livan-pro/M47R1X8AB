<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <Label text="Суицид" dock="left" class="h2" />
      <CharacterItem :data="character" />
      <Label text="Вы действительно хотите совершить суицид?" dock="left" class="h3" textWrap="true" />
      <LoadingButton :loading="loading" text="Суицид" @tap="doSuicide" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "@/components/CharacterItem.vue";
import LoadingButton from "@/components/LoadingButton.vue";

import { MainCharacterInfo_me_mainCharacter as Character } from "@/gql/__generated__/MainCharacterInfo";
import suicide, { createUpdate } from "@/gql/Suicide";

@Component({
  components: { CharacterItem, LoadingButton },
})
export default class ItemTransferAmountModal extends Vue {
  @Prop({
    type: Object,
    default: () => ({
      __typename: "Character",
      id: -1,
      name: "неизвестно",
      own: false,
      avatarUploadedAt: null,
    }),
  })
  character!: Character;
  loading = false;

  async doSuicide() {
    this.loading = true;
    try {
      await this.$apollo.mutate({ ...suicide, update: createUpdate(this.character.id) });
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
}
</script>

<style scoped>
button {
  margin: 16px 0;
}
</style>
