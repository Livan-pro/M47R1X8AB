<template>
  <icon-btn
    :tooltip="value ? 'Сделать НЕ администратором' : 'Сделать администратором'"
    icon="mdi-account-supervisor"
    :color="value ? 'green' : 'red'"
    :loading="loading"
    @click="makeAdmin"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import MakeAdmin, { createUpdate } from "~/gql/MakeAdmin";
import IconBtn from "~/components/IconBtn.vue";

@Component({
  components: { IconBtn },
})
export default class MakeAdminButton extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: Boolean }) value!: boolean;
  loading = false;

  async makeAdmin() {
    this.loading = true;
    const value = !this.value;
    try {
      await this.$apollo.mutate({ ...MakeAdmin, variables: { id: this.id, value: value }, update: createUpdate(this.id, value) });
      if (value) this.$root.$emit("snackbar", { text: `Пользователь (ID${this.id}) стал администратором!`, color: "error" });
      else this.$root.$emit("snackbar", { text: `Пользователь (ID${this.id}) перестал быть администратором!`, color: "success" });
    } catch (error) {
      this.$root.$emit("snackbar", {
        text: ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message,
        color: "error",
      });
    }
  }
}
</script>
