<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Перевод денег" dock="left" class="h2" />
        <CharacterItem :id="id" :avatarUploadedAt="character.avatarUploadedAt" :name="character.name" :own="character.own" @tap.prevent="" />
        <TextField v-model="amount" hint="Сумма" keyboardType="number" returnKeyType="done" @returnPress="doTransfer" />
        <Button text="Перевести" @tap="doTransfer" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import gql from "graphql-tag";
import CharacterItem from "@/components/CharacterItem.vue";

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
export default class MoneyTransferAmountModal extends Vue {
  @Prop({type: Number, default: -1}) id!: number;
  amount = "";
  character: any = {};
  loading = false;

  async doTransfer() {
    this.loading = true;
    const amount = parseInt(this.amount, 10);
    try {
      const result = await this.$apollo.mutate({
        mutation: gql`mutation($id: Int!, $amount: Int!) {
          moneyTransfer(id: $id, amount: $amount)
        }`,
        variables: {
          id: this.id,
          amount,
        },
      });
      await alert({
        title: "Успех",
        message: `Вы перевели ${amount} кредитов пользователю ${this.character.name}`,
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
Button {
  margin: 16px 0;
}
</style>
