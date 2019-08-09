<template>
  <StackLayout class="p-b-10">
    <Label text="Вы действительно хотите перевести деньги?" text-wrap="true" dock="left" class="h2" />
    <CharacterItem :id="id" :avatar-uploaded-at="character.avatarUploadedAt" :name="character.name" :own="character.own" @tap.prevent="" />
    <Label :text="`Сумма: ${amount}`" text-wrap="true" dock="left" class="h2" />
    <Button text="Перевести" @tap="doTransfer" />
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "./CharacterItem.vue";

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
          id: (this as ConfirmQRMoneyTransfer).id,
        };
      },
    },
  },
})
export default class ConfirmQRMoneyTransfer extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: Number, default: 0 }) amount!: number;
  character: Character | {} = {};

  loading = false;

  async doTransfer() {
    this.loading = true;
    try {
      await this.$apollo.mutate({
        ...MoneyTransfer,
        variables: {
          id: this.id,
          amount: this.amount,
        },
        update: createUpdate(this.amount),
      });
      await alert({
        title: "Успех",
        message: `Вы перевели ${this.amount} кредитов пользователю ${(this.character as Character).name}`,
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
  }
}
</script>

<style scoped></style>
