<template>
  <v-layout justify-center>
    <v-dialog :value="value" @input="$emit('input', $event)" width="max-content">
      <vue-qr v-if="value" :text="text" v-bind="settings" style="margin-bottom: -6px" />
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VueQr from "vue-qr";

@Component({
  components: { VueQr },
})
export default class QRCodeSettings extends Vue {
  @Prop({ type: Boolean, default: false }) value!: boolean;
  @Prop({ type: String, default: "" }) text!: boolean;

  settings = {};

  created() {
    this.updateSettings();
    this.$root.$on("qrSettingsUpdate", this.updateSettings);
  }

  beforeDestroy() {
    this.$root.$off("qrSettingsUpdate", this.updateSettings);
  }

  updateSettings() {
    this.settings = JSON.parse(localStorage.getItem("qrSettings") || "{}");
  }
}
</script>
