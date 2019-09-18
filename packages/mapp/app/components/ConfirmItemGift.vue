<template>
  <StackLayout class="p-b-10">
    <CharacterItem :data="me.mainCharacter" @tap.prevent="" />
    <Label text="Вы действительно хотите получить предмет?" textWrap="true" dock="left" class="h2" />
    <Button text="Получить" @tap="doUse" />
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "./CharacterItem.vue";

import me from "@/gql/MainCharacterInfo";
import UseItemGift from "@/gql/UseItemGift";
import { MainCharacterInfo_me as Me } from "@/gql/__generated__/MainCharacterInfo";
import { UseItemGift as UseItemGiftType } from "@/gql/__generated__/UseItemGift";
import { items } from "@/utils/items";

@Component({
  components: { CharacterItem },
  apollo: {
    me,
  },
})
export default class ConfirmItemGift extends Vue {
  @Prop({ type: String, default: "" }) code!: string;
  me: Me = {
    __typename: "User",
    mainCharacter: {
      __typename: "Character",
      id: -1,
      name: "неизвестно",
      avatarUploadedAt: null,
      own: true,
    },
  };

  loading = false;

  async doUse() {
    this.loading = true;
    try {
      const result = await this.$apollo.mutate<UseItemGiftType>({
        ...UseItemGift,
        variables: {
          code: this.code,
        },
      });
      await alert({
        title: "Успех",
        message: `Вы получили ${this.getItemName(result.data.useItemGift.itemId, result.data.useItemGift.amount)}!`,
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

  getItemName(itemId: number, amount: number) {
    return `${(items[itemId] || { name: "Неизвестный предмет" }).name} (${amount})`;
  }
}
</script>

<style scoped></style>
