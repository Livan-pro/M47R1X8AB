<template>
  <StackLayout class="p-b-10">
    <CharacterItem :data="me.mainCharacter" />
    <Label text="Вы действительно хотите использовать лекарство?" textWrap="true" dock="left" class="h2" />
    <LoadingButton :loading="loading" text="Использовать" @tap="doUse" />
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "./CharacterItem.vue";
import LoadingButton from "@/components/LoadingButton.vue";

import me from "@/gql/MainCharacterInfo";
import UseMedicine from "@/gql/UseMedicine";
import { MainCharacterInfo_me as Me } from "@/gql/__generated__/MainCharacterInfo";

@Component({
  components: { CharacterItem, LoadingButton },
  apollo: {
    me,
  },
})
export default class ConfirmMedicine extends Vue {
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
        ...UseMedicine,
        variables: {
          code: this.code,
        },
      });
      await alert({
        title: "Успех",
        message: "Вы использовали лекарство!",
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
