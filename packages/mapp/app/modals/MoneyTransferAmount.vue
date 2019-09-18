<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Перевод денег" dock="left" class="h2" />
        <CharacterItem :data="character" @tap.prevent="" />
        <TextField v-model="amount" hint="Сумма" keyboardType="number" returnKeyType="done" @returnPress="doTransfer" />
        <Button text="Перевести" @tap="doTransfer" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "@/components/CharacterItem.vue";

import CharacterById from "@/gql/CharacterById";
import MoneyTransfer, { createUpdate } from "@/gql/MoneyTransfer";
import { CharacterById_character as Character } from "@/gql/__generated__/CharacterById";

@Component({
  components: { CharacterItem },
  apollo: {
    character: {
      ...CharacterById,
      variables() {
        return {
          id: (this as MoneyTransferAmountModal).id,
        };
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
        update: createUpdate(amount),
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
