<template>
  <StackLayout class="p-b-10">
    <CharacterItem :data="me.mainCharacter" @tap.prevent="" />
    <Label text="Вы действительно хотите использовать медпак?" textWrap="true" dock="left" class="h2" />
    <Button text="Использовать" @tap="doUse" />
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "./CharacterItem.vue";

import me from "@/gql/MainCharacterInfo";
import UseMedpack from "@/gql/UseMedpack";
import { MainCharacterInfo_me as Me } from "@/gql/__generated__/MainCharacterInfo";

@Component({
  components: { CharacterItem },
  apollo: {
    me,
  },
})
export default class ConfirmMedpack extends Vue {
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
      await this.$apollo.mutate({
        ...UseMedpack,
        variables: {
          code: this.code,
        },
      });
      await alert({
        title: "Успех",
        message: "Вы использовали медпак!",
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
