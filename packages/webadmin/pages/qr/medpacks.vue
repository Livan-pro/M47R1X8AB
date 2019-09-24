<template>
  <v-layout justify-center>
    <QRCodeEditor title="QR-коды медпаков" createTitle="Создание QR-кода медпака" :list="medpacks" :create="createMedpack" />
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import QRCodeEditor from "~/components/QRCodeEditor.vue";
import medpacks from "~/gql/Medpacks";
import { Medpacks_medpacks as Medpack } from "~/gql/__generated__/Medpacks";
import CreateMedpack from "~/gql/CreateMedpack";

@Component({
  components: {
    QRCodeEditor,
  },
  apollo: {
    medpacks,
  },
  meta: {
    auth: true,
  },
})
export default class MedpacksPage extends Vue {
  medpacks: Medpack[] = [];

  async createMedpack(variables: object) {
    await this.$apollo.mutate({ ...CreateMedpack, variables });
  }
}
</script>
