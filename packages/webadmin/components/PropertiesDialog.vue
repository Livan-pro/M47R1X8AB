<template>
  <v-layout justify-center>
    <v-dialog :value="value" @input="$emit('input', $event)" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ name }} (ID{{ id }}). Редактирование свойств</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Название</th>
                  <th class="text-left">Значение</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr v-for="prop in properties" :key="prop.name">
                  <td>{{ prop.name }}</td>
                  <td>
                    <v-edit-dialog :return-value.sync="prop.value" @save="update(prop.name, prop.value)">
                      {{ prop.value }}
                      <template v-slot:input>
                        <v-text-field v-model="prop.value" :rules="[max255chars]" label="Значение" single-line counter />
                      </template>
                    </v-edit-dialog>
                  </td>
                  <td>
                    <icon-btn icon="mdi-delete" tooltip="Удалить" color="red" @click="update(prop.name, '')" />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <v-text-field v-model="newName" :rules="[max255chars]" label="Название" single-line counter @keyup.enter="focus('newValue')" />
                  </td>
                  <td>
                    <v-text-field
                      ref="newValue"
                      v-model="newValue"
                      :rules="[max255chars]"
                      label="Значение"
                      single-line
                      counter
                      @keyup.enter="update(newName, newValue)"
                    />
                  </td>
                  <td>
                    <icon-btn icon="mdi-plus" tooltip="Добавить" color="green" @click="update(newName, newValue)" />
                  </td>
                </tr>
              </tfoot>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { maxChars } from "~/utils";
import IconBtn from "~/components/IconBtn.vue";

import EditProperty, { createUpdate } from "~/gql/EditProperty";
import properties from "~/gql/Properties";
import { properties as Character } from "~/gql/__generated__/Properties";

@Component({
  components: { IconBtn },
  apollo: {
    character: {
      ...properties,
      variables(this: PropertiesDialog) {
        return {
          id: this.id,
        };
      },
      skip(this: PropertiesDialog) {
        return this.id < 0;
      },
    },
  },
})
export default class PropertiesDialog extends Vue {
  @Prop({ type: Boolean, default: false }) value!: boolean;
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: String, default: "" }) name!: string;
  character: Character = {
    __typename: "Character",
    properties: [],
  };
  loading = false;
  newName = "";
  newValue = "";

  async update(name: string, value: string) {
    this.loading = true;
    try {
      await this.$apollo.mutate({
        ...EditProperty,
        variables: { characterId: this.id, name, value },
        update: createUpdate(this.id, name, value),
      });
    } catch (error) {
      this.$root.$emit("snackbar", {
        text: ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message,
        color: "error",
      });
    }
    this.loading = false;
  }

  focus(ref: string) {
    (this.$refs[ref] as HTMLElement).focus();
  }

  max255chars = maxChars(255);

  get properties() {
    return this.character.properties;
  }
}
</script>
