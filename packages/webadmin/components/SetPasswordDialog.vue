<template>
  <v-layout justify-center>
    <v-dialog :value="value" @input="$emit('input', $event)" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Смена пароля для {{ email }} (ID{{ id }})</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="password"
            :append-icon="show ? 'visibility' : 'visibility_off'"
            :type="show ? 'text' : 'password'"
            label="Новый пароль"
            required
            counter
            @click:append="show = !show"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$emit('input', false)">Закрыть</v-btn>
          <v-btn color="primary" text :loading="loading" @click="save">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import SetPassword from "~/gql/SetPassword";

@Component
export default class SetPasswordDialog extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: String, default: "" }) email!: string;
  @Prop({ type: Boolean }) value!: boolean;
  loading = false;
  show = false;
  password = "";

  async save() {
    this.loading = true;
    try {
      await this.$apollo.mutate({ ...SetPassword, variables: { id: this.id, password: this.password } });
      this.$root.$emit("snackbar", { text: "Новый пароль установлен!", color: "success" });
    } catch (error) {
      this.$root.$emit("snackbar", {
        text: ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message,
        color: "error",
      });
    }
    this.$emit("input", false);
    this.loading = false;
  }
}
</script>
