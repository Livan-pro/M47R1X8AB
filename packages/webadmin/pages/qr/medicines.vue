<template>
  <v-layout justify-center>
    <QRCodeEditor
      title="QR-коды лекарств"
      createTitle="Создание QR-кода лекарства"
      :list="medicines"
      :create="createMedicine"
      :getQrText="getQrText"
    />
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import QRCodeEditor from "~/components/QRCodeEditor.vue";
import medicines from "~/gql/Medicines";
import { Medicines_medicines as Medicine } from "~/gql/__generated__/Medicines";
import CreateMedicine from "~/gql/CreateMedicine";

@Component({
  components: {
    QRCodeEditor,
  },
  apollo: {
    medicines,
  },
  meta: {
    auth: true,
  },
})
export default class MedicinesPage extends Vue {
  medicines: Medicine[] = [];

  async createMedicine(variables: object) {
    await this.$apollo.mutate({ ...CreateMedicine, variables });
  }

  getQrText(item: Medicine) {
    return item ? `cbrpnk://me/${item.code}` : "";
  }
}
</script>
