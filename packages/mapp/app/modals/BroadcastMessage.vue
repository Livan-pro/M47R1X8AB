<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Рассылка" dock="left" class="h2" />
        <Label text="Внимание! Данное сообщение увидят все пользователи матрицы!" dock="left" class="h3" textWrap="true" />
        <TextView v-model="text" hint="Сообщение" editable="true" />
        <LoadingButton :loading="loading" text="Отправить" @tap="broadcast" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import LoadingButton from "@/components/LoadingButton.vue";

import BroadcastMessage from "@/gql/BroadcastMessage";

@Component({
  components: { LoadingButton },
})
export default class BroadcastMessageModal extends Vue {
  loading = false;
  text = "";

  async broadcast() {
    this.loading = true;
    try {
      await this.$apollo.mutate({
        ...BroadcastMessage,
        variables: {
          text: this.text,
        },
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
