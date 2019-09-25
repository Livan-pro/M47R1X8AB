<template>
  <v-edit-dialog :return-value.sync="addAmount" @save="addItems">
    {{ amount }}
    <template v-slot:input>
      <v-text-field v-model.number="addAmount" type="number" label="Добавить предметы" />
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import AddItemsMutation, { createUpdate } from "~/gql/AddItems";

@Component
export default class AddItems extends Vue {
  @Prop({ type: Number, default: -1 }) characterId!: number;
  @Prop({ type: Number, default: -1 }) itemId!: number;
  @Prop({ type: Number, default: 0 }) amount!: number;
  addAmount = 0;

  async addItems() {
    await this.$apollo.mutate({
      ...AddItemsMutation,
      variables: { characterId: this.characterId, itemId: this.itemId, amount: +this.addAmount },
      update: createUpdate(this.characterId),
    });
  }
}
</script>
