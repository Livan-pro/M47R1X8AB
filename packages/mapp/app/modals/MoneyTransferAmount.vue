<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Перевод денег" dock="left" class="h2" />
        <CharacterItem :data="character" />
        <TextField v-model="amount" hint="Сумма" keyboardType="number" returnKeyType="done" class="m-t-5" @returnPress="doTransfer" />
        <LoadingButton :loading="loading" text="Перевести" @tap="doTransfer" />
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
import MoneyTransfer from "@/gql/MoneyTransfer";
import { CharacterById_character as Character } from "@/gql/__generated__/CharacterById";

@Component({
  components: { CharacterItem, LoadingButton },
  apollo: {
    character: {
      ...CharacterById,
      variables(this: MoneyTransferAmountModal) {
        return {
          id: this.id,
        };
      },
      skip(this: MoneyTransferAmountModal) {
        return this.id < 0;
      },
    },
  },
})
export default class MoneyTransferAmountModal extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
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
        ...MoneyTransfer,
        variables: {
          id: this.id,
          amount,
        },
      });
      await alert({
        title: "Успех",
        message: `Вы перевели ${amount} кредитов пользователю ${(this.character as Character).name}`,
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
}
</script>

<style scoped>
button {
  margin: 16px 0;
}
</style>
