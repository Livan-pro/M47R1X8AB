<template>
  <v-layout justify-center>
    <v-dialog :value="value" @input="$emit('input', $event)" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ name }} (ID{{ id }}). Редактирование инвентаря</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">ID</th>
                  <th class="text-left">Название</th>
                  <th class="text-left">Количество</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.itemId">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td><add-items :characterId="id" :itemId="item.id" :amount="item.amount" /></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { items } from "~/utils/items";
import IconBtn from "~/components/IconBtn.vue";
import AddItems from "~/components/AddItems.vue";

import inventory from "~/gql/Inventory";
import { Inventory_inventory as Item } from "~/gql/__generated__/Inventory";

@Component({
  components: { IconBtn, AddItems },
  apollo: {
    inventory: {
      ...inventory,
      variables(this: InventoryDialog) {
        return {
          id: this.id,
        };
      },
      skip(this: InventoryDialog) {
        return this.id < 0;
      },
    },
  },
})
export default class InventoryDialog extends Vue {
  @Prop({ type: Boolean, default: false }) value!: boolean;
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: String, default: "" }) name!: string;
  inventory: Item[] = [];
  loading = false;

  get items() {
    return Object.values(items).map(item => ({ ...item, amount: (this.inventory.find(i => i.itemId === item.id) || { amount: 0 }).amount }));
  }
}
</script>
