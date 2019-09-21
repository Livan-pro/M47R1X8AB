<template>
  <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y full-width min-width="290px">
    <template v-slot:activator="{ on }">
      <v-text-field :value="valueFormatted" @input="update" :label="label" prepend-icon="mdi-calendar" readonly v-on="!readonly && on" />
    </template>
    <v-date-picker
      :value="valueISO"
      @input="
        update($event);
        menu = false;
      "
    />
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class InputDate extends Vue {
  @Prop({ type: Date, default: new Date() }) value!: Date;
  @Prop({ type: String }) label!: string;
  @Prop({ type: Boolean, default: false }) readonly!: boolean;
  menu = false;

  get valueISO() {
    return this.value.toISOString().substr(0, 10);
  }

  get valueFormatted() {
    return this.value.toLocaleDateString();
  }

  update(value) {
    this.$emit("input", new Date(value));
  }
}
</script>
