<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Передача предмета" dock="left" class="h2" />
        <CharacterItem :data="character" />
        <TextField v-model="amount" hint="Количество" keyboardType="number" returnKeyType="done" class="m-t-5" @returnPress="doTransfer" />
        <LoadingButton :loading="loading" text="Передать" @tap="doTransfer" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "@/components/CharacterItem.vue";
import LoadingButton from "@/components/LoadingButton.vue";

import CharacterById from "@/gql/CharacterById";
import ItemTransfer, { createUpdate } from "@/gql/ItemTransfer";
import { CharacterById_character as Character } from "@/gql/__generated__/CharacterById";
import { items } from "@/utils/items";

@Component({
  components: { CharacterItem, LoadingButton },
  apollo: {
    character: {
      ...CharacterById,
      variables(this: ItemTransferAmountModal) {
        return {
          id: this.characterId,
        };
      },
      skip(this: ItemTransferAmountModal) {
        return this.characterId < 0;
      },
    },
  },
})
export default class ItemTransferAmountModal extends Vue {
  @Prop({ type: Number, default: -1 }) characterId!: number;
  @Prop({ type: Number, default: -1 }) itemId!: number;
  amount = "";
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

  async doTransfer() {
    this.loading = true;
    const amount = parseInt(this.amount, 10);
    try {
      await this.$apollo.mutate({
        ...ItemTransfer,
        variables: {
          characterId: this.characterId,
          itemId: this.itemId,
          amount,
        },
        update: createUpdate(this.itemId, amount),
      });
      await alert({
        title: "Успех",
        message: `Вы передали ${amount} предметов типа ${this.item.name} пользователю ${this.character.name}`,
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

  get item() {
    return items[this.itemId] || { name: "Неизвестный предмет" };
  }
}
</script>

<style scoped>
button {
  margin: 16px 0;
}
</style>
