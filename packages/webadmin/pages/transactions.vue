<template>
  <v-card>
    <v-card-title>
      Транзакции
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-search" label="Поиск" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :search="search" sort-by="id" class="elevation-1" multi-sort>
      <template v-slot:item.createdAt="{ value }">
        {{ formatDate(value) }}
      </template>
      <template v-slot:item.from.name="{ item: { from: value } }">
        <v-layout align-center>
          <CharacterAvatar :id="value.id" class="mr-1" :size="50" :avatar-uploaded-at="value.avatarUploadedAt" />
          {{ value.name }}
        </v-layout>
      </template>
      <template v-slot:item.to.name="{ item: { to: value } }">
        <v-layout align-center>
          <CharacterAvatar :id="value.id" class="mr-1" :size="50" :avatar-uploaded-at="value.avatarUploadedAt" />
          {{ value.name }}
        </v-layout>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import allBalanceHistory from "~/gql/BalanceHistory";
import { BalanceHistory_allBalanceHistory as BalanceTransfer } from "~/gql/__generated__/BalanceHistory";
import CharacterAvatar from "~/components/CharacterAvatar.vue";

@Component({
  components: { CharacterAvatar },
  apollo: {
    allBalanceHistory,
  },
  meta: {
    auth: true,
  },
})
export default class TransactionsPage extends Vue {
  allBalanceHistory: BalanceTransfer[] = [];
  search = "";

  get headers() {
    return [
      { text: "ID", value: "id" },
      { text: "Дата", value: "date" },
      { text: "От кого", value: "from.name" },
      { text: "Кому", value: "to.name" },
      { text: "Количество", value: "amount" },
    ];
  }

  get items() {
    return this.allBalanceHistory.map(t => ({ ...t, date: this.formatDate(t.createdAt) }));
  }

  formatDate(value: number) {
    return new Date(value).toLocaleString();
  }
}
</script>

<style lang="sass">
tr td:last-child
  width: 1%
  white-space: nowrap
</style>
