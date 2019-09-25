<template>
  <v-layout justify-center>
    <v-dialog :value="value" @input="$emit('input', $event)" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Код" required v-model="code" counter="16" append-icon="mdi-dice-5-outline" @click:append="generateCode" />
          <v-text-field v-for="f in fields" :key="f.name" :label="f.label" required v-model="data[f.name]" :type="f.type" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$emit('input', false)">Закрыть</v-btn>
          <v-btn color="success" text :loading="loading" @click="save">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { FieldDescription } from "./QRCodeEditor.vue";

@Component
export default class QRCodeCreateDialog extends Vue {
  @Prop({ type: Boolean, default: false }) value!: boolean;
  @Prop({ type: String, default: "Создание QR-кода" }) title!: string;
  @Prop({ type: Function, default: () => null }) create!: (variables: object) => Promise<void>;
  @Prop({ type: Array, default: () => [] }) fields!: FieldDescription[];

  loading = false;
  code = "";
  data = {};

  created() {
    this.updateFields();
  }

  @Watch("fields")
  updateFields() {
    for (const f of this.fields) {
      if (!Object.hasOwnProperty.call(this.data, f.name)) this.data[f.name] = "";
    }
  }

  async save() {
    this.loading = true;
    const data = { ...this.data };
    for (const f of this.fields) {
      if (f.type === "number") data[f.name] = +data[f.name];
    }
    try {
      await this.create({ ...data, code: this.code });
    } catch (error) {
      this.$root.$emit("snackbar", {
        text: ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message,
        color: "error",
      });
    }
    this.$emit("input", false);
    this.loading = false;
  }

  generateCode() {
    this.code =
      Math.floor(Math.random() * 2 ** (8 * 4))
        .toString(16)
        .padStart(8, "0") +
      Math.floor(Math.random() * 2 ** (8 * 4))
        .toString(16)
        .padStart(8, "0");
  }
}
</script>
