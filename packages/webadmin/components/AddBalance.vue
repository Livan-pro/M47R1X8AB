<template>
  <v-edit-dialog :return-value.sync="amount" @save="addBalance(id, amount)">
    {{ balance }}
    <template v-slot:input>
      <v-text-field v-model.number="amount" type="number" label="Добавить на баланс" />
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import AddBalanceMutation from "~/gql/AddBalance";

@Component
export default class AddBalance extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: Number, default: 0 }) balance!: number;
  amount = 0;

  async addBalance(id: number, amount: number) {
    await this.$apollo.mutate({ ...AddBalanceMutation, variables: { id, amount } });
  }
}
</script>
