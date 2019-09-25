<template>
  <v-layout justify-center>
    <v-dialog :value="value" @input="$emit('input', $event)" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ name }} (ID{{ id }}). Редактирование имплантов</span>
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">ID</th>
                  <th class="text-left">Название</th>
                  <th class="text-left">Тип</th>
                  <th class="text-left">Работает</th>
                  <th class="text-left">Качественный</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr v-for="implant in implants" :key="implant.id">
                  <td>{{ implant.id }}</td>
                  <td>
                    <v-edit-dialog @save="update(implant.id, { name: implant.name })">
                      {{ implant.name }}
                      <template v-slot:input>
                        <v-text-field v-model="implant.name" :rules="[max255chars]" label="Название" single-line counter />
                      </template>
                    </v-edit-dialog>
                  </td>
                  <td>
                    <v-edit-dialog @save="update(implant.id, { type: implant.type })" large cancel-text="Отменить" save-text="Сохранить">
                      {{ getTypeText(implant.type) }}
                      <template v-slot:input>
                        <v-radio-group v-model="implant.type" hide-details>
                          <v-radio v-for="type in typeOptions" :key="type.value" :label="type.text" :value="type.value" />
                        </v-radio-group>
                      </template>
                    </v-edit-dialog>
                  </td>
                  <td>
                    <v-checkbox
                      v-model="implant.working"
                      label="Да"
                      class="single-line"
                      hide-details
                      @change="update(implant.id, { working: $event })"
                    ></v-checkbox>
                  </td>
                  <td>
                    <v-checkbox
                      v-model="implant.quality"
                      label="Да"
                      class="single-line"
                      hide-details
                      @change="update(implant.id, { quality: $event })"
                    ></v-checkbox>
                  </td>
                  <td>
                    <icon-btn icon="mdi-transfer-right" tooltip="Передать другому персонажу..." color="orange" @click="transferImplant(implant.id)" />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  <td class="pb-1">
                    <v-text-field v-model="newName" :rules="[max255chars]" label="Название" single-line hide-details />
                  </td>
                  <td>
                    <v-select v-model="newType" :items="typeOptions" label="Тип" single-line hide-details />
                  </td>
                  <td>
                    <v-checkbox v-model="newWorking" label="Да" hide-details class="single-line" />
                  </td>
                  <td>
                    <v-checkbox v-model="newQuality" label="Да" @keyup.enter="createImplant" hide-details class="single-line" />
                  </td>
                  <td>
                    <icon-btn icon="mdi-plus" tooltip="Создать" color="green" @click="createImplant" />
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
import { maxChars, implantTypeOptions, implantTypeToText } from "~/utils";
import IconBtn from "~/components/IconBtn.vue";

import implants from "~/gql/Implants";
import { Implants_implants as Implant } from "~/gql/__generated__/Implants";
import { ImplantType, FullImplantInput } from "~/gql/__generated__/globalTypes";
import { createMutation } from "~/gql/UpdateImplant";
import CreateImplant, { createUpdate } from "~/gql/CreateImplant";

@Component({
  components: { IconBtn },
  apollo: {
    implants: {
      ...implants,
      variables(this: ImplantsDialog) {
        return {
          id: this.id,
        };
      },
      skip(this: ImplantsDialog) {
        return this.id < 0;
      },
    },
  },
})
export default class ImplantsDialog extends Vue {
  @Prop({ type: Boolean, default: false }) value!: boolean;
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop({ type: String, default: "" }) name!: string;
  implants: Implant[] = [];
  loading = false;
  newName = "";
  newType = ImplantType.Brain;
  newWorking = true;
  newQuality = true;

  async update(id: number, data: FullImplantInput) {
    this.loading = true;
    try {
      await this.$apollo.mutate(createMutation(id, data, this.id));
    } catch (error) {
      this.$root.$emit("snackbar", {
        text: ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message,
        color: "error",
      });
    }
    this.loading = false;
  }

  async createImplant() {
    this.loading = true;
    try {
      await this.$apollo.mutate({
        ...CreateImplant,
        variables: { data: { characterId: this.id, name: this.newName, type: this.newType, working: this.newWorking, quality: this.newQuality } },
        update: createUpdate(this.id),
      });
    } catch (error) {
      this.$root.$emit("snackbar", {
        text: ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message,
        color: "error",
      });
    }
    this.loading = false;
  }

  async transferImplant(id: number) {
    this.$root.$emit("dialog", {
      title: "Передача импланта",
      text: "Введите ID персонажа, которому необходимо передать имплант:",
      color: "orange",
      buttonText: "Передать",
      inputLabel: "ID персонажа",
      callback: (characterId: string) => this.update(id, { characterId: +characterId }),
    });
  }

  max255chars = maxChars(255);
  typeOptions = implantTypeOptions;
  getTypeText = implantTypeToText;
}
</script>
