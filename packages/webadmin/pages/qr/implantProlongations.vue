<template>
  <v-layout justify-center>
    <QRCodeEditor
      title="QR-коды продлений имплантов"
      createTitle="Создание QR-кода продления импланта"
      :list="implantProlongations"
      :create="createImplantProlongation"
      :fields="fields"
      :getQrText="getQrText"
    />
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import QRCodeEditor from "~/components/QRCodeEditor.vue";
import implantProlongations from "~/gql/ImplantProlongations";
import { ImplantProlongations_implantProlongations as ImplantProlongation } from "~/gql/__generated__/ImplantProlongations";
import CreateImplantProlongation from "~/gql/CreateImplantProlongation";

@Component({
  components: {
    QRCodeEditor,
  },
  apollo: {
    implantProlongations,
  },
  meta: {
    auth: true,
  },
})
export default class ImplantProlongationsPage extends Vue {
  implantProlongations: ImplantProlongation[] = [];

  get fields() {
    return [{ name: "time", label: "Время (мс)", type: "number" }];
  }

  async createImplantProlongation(variables: object) {
    await this.$apollo.mutate({ ...CreateImplantProlongation, variables });
  }

  getQrText(item: ImplantProlongation) {
    return item ? `cbrpnk://ip/${item.code}` : "";
  }
}
</script>
