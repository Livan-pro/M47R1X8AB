<template>
  <StackLayout class="p-b-10">
    <Label text="Вы действительно хотите перевести деньги?" textWrap="true" dock="left" class="h2" />
    <CharacterItem v-if="character" :data="character" />
    <Label :text="`Сумма: ${amount}`" textWrap="true" dock="left" class="h2" />
    <LoadingButton :loading="loading" text="Перевести" @tap="doTransfer" />
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "./CharacterItem.vue";
import LoadingButton from "@/components/LoadingButton.vue";

import CharacterInfoById from "@/gql/CharacterInfoById";
import MoneyTransfer from "@/gql/MoneyTransfer";
import { CharacterInfoById_character as Character } from "@/gql/__generated__/CharacterInfoById";

@Component({
  components: { CharacterItem, LoadingButton },
  apollo: {
    character: {
      ...CharacterInfoById,
      variables(this: ConfirmQRMoneyTransfer) {
        return {
          id: this.id,
        };
      },
      skip(this: ConfirmQRMoneyTransfer) {
        return this.id < 0;
      },
    },
  },
})
export default class ConfirmQRMoneyTransfer extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: Number, default: 0 }) amount!: number;
  character: Character = {
    __typename: "Character",
    id: -1,
    name: "неизвестно",
    own: false,
    avatarUploadedAt: null,
    profession: null,
    professionLevel: null,
  };

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
      });
      await alert({
        title: "Успех",
        message: `Вы перевели ${this.amount} кредитов пользователю ${(this.character as Character).name}`,
        okButtonText: "ОК",
      });
      this.$root.$emit("selectTab", 4);
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
