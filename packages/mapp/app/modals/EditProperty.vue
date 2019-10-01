<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <Label text="Редактирование свойства" dock="left" class="h2" />
      <TextField v-model="newName" hint="Название" maxLength="255" returnKeyType="next" class="m-b-10" />
      <TextField v-model="newValue" hint="Значение" maxLength="255" returnKeyType="done" class="m-b-5" @returnPress="save" />
      <LoadingButton :loading="loading" text="Сохранить" @tap="save" />
      <LoadingButton :loading="loading" text="Удалить" @tap="remove" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import LoadingButton from "@/components/LoadingButton.vue";

import EditProperty, { createUpdate } from "@/gql/EditProperty";

@Component({ components: { LoadingButton } })
export default class EditPropertyModal extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: String, default: "" }) name!: string;
  @Prop({ type: String, default: "" }) value!: string;
  loading = false;
  newName = "";
  newValue = "";

  created() {
    this.newName = this.name;
    this.newValue = this.value;
  }

  async remove() {
    this.newValue = "";
    await this.save();
  }

  async save() {
    if (this.newName.length < 1) {
      await alert({
        title: "Ошибка",
        message: "Вы должны ввести название свойства!",
        okButtonText: "ОК",
      });
      return;
    }
    this.loading = true;
    try {
      await this.$apollo.mutate({
        ...EditProperty,
        variables: {
          characterId: this.id,
          name: this.newName,
          value: this.newValue,
        },
        update: createUpdate(this.id, this.newName, this.newValue),
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
