<template>
  <v-layout justify-center>
    <v-card>
      <v-card-title>
        Локации
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-search" label="Поиск" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="items" :search="search" sort-by="id" class="elevation-1" multi-sort>
        <template v-slot:item.name="{ item }">
          <v-edit-dialog :return-value.sync="item.name" @save="update(item.id, { name: item.name })">
            {{ item.name }}
            <template v-slot:input>
              <v-text-field v-model="item.name" :rules="rules" label="Название" single-line counter />
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:footer>
          <tr>
            <td />
            <td><v-text-field v-model="newName" :rules="rules" label="Название" single-line counter @keyup.enter="create" /></td>
            <td>
              <icon-btn icon="mdi-plus" tooltip="Добавить" color="green" @click="create" />
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import me from "~/gql/MyRoles";
import { MyRoles_me as Me } from "~/gql/__generated__/MyRoles";
import IconBtn from "~/components/IconBtn.vue";
import locations from "~/gql/Locations";
import { Locations_locations as Location } from "~/gql/__generated__/Locations";
import { maxChars } from "~/utils";
import { createMutation } from "~/gql/UpdateLocation";
import { LocationInput } from "~/gql/__generated__/globalTypes";
import CreateLocation from "~/gql/CreateLocation";

@Component({
  components: { IconBtn },
  apollo: {
    locations,
    me,
  },
  meta: {
    auth: true,
  },
})
export default class LocationsPage extends Vue {
  locations: Location[] = [];
  me: Me = { __typename: "User", roles: [] };

  search = "";

  newName = "";

  get headers() {
    return [{ text: "ID", value: "id", width: 100 }, { text: "Название", value: "name" }, { value: "actions", sortable: false }];
  }

  get items() {
    return this.locations;
  }

  get editable() {
    return [{ key: "name", rules: [maxChars(255)], name: "Название" }];
  }

  async update(id: number, data: LocationInput) {
    await this.$apollo.mutate(createMutation(id, data));
  }

  async create() {
    await this.$apollo.mutate({ ...CreateLocation, variables: { data: { name: this.newName } } });
  }

  get rules() {
    return [maxChars(255)];
  }
}
</script>

<style lang="sass">
tr td:last-child
  width: 1%
  white-space: nowrap
</style>
