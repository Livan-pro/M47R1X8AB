<template>
  <StackLayout class="p-b-10">
    <Label text="Вы действительно хотите перевести деньги?" textWrap="true" dock="left" class="h2" />
    <CharacterItem :id="id" :avatarUploadedAt="character.avatarUploadedAt" :name="character.name" :own="character.own" @tap.prevent="" />
    <Label :text="`Сумма: ${amount}`" textWrap="true" dock="left" class="h2" />
    <Button text="Перевести" @tap="doTransfer" />
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import gql from "graphql-tag";
import CharacterItem from './CharacterItem.vue';

@Component({
  components: { CharacterItem },
  apollo: {
    character: {
      query: gql`query($id: Int!) {
        character(id: $id) {
          id
          name
          own
          avatarUploadedAt
        }
      }`,
      variables() {
        return {
          id: (this as any).id,
        };
      },
      fetchPolicy: "cache-and-network",
    },
  },
})
export default class ConfirmQRMoneyTransfer extends Vue {
  @Prop({type: Number, default: -1}) id!: number;
  @Prop({type: Number, default: 0}) amount!: number;
  character: any = {};

  loading = false;

  async doTransfer() {
    this.loading = true;
    try {
      const result = await this.$apollo.mutate({
        mutation: gql`mutation($id: Int!, $amount: Int!) {
          moneyTransfer(id: $id, amount: $amount)
        }`,
        variables: {
          id: this.id,
          amount: this.amount,
        },
      });
      await alert({
        title: "Успех",
        message: `Вы перевели ${this.amount} кредитов пользователю ${this.character.name}`,
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

<style scoped>
</style>
