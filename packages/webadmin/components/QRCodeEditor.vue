<template>
  <v-card>
    <QRCodeCreateDialog v-model="dialog" :title="createTitle" :create="create" :fields="fields" />
    <v-card-title>
      {{ title }}
      <icon-btn class="ml-2" icon="mdi-plus" color="green" tooltip="Создать" @click="createQRCode" />
      <v-spacer />
      <v-text-field v-model="search" append-icon="mdi-search" label="Поиск" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :search="search" sort-by="id" class="elevation-1" multi-sort>
      <template v-for="edit in editable" v-slot:[`item.${edit.key}`]="{ item }">
        <v-edit-dialog :key="edit.key" :return-value.sync="item[edit.key]" @save="update(item.id, { [edit.key]: item[edit.key] })">
          {{ item[edit.key] }}
          <template v-slot:input>
            <v-text-field v-model="item[edit.key]" :rules="edit.rules" :label="edit.name" single-line counter />
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.usedByText="{ item }">
        <v-layout v-if="item.usedBy" align-center>
          <CharacterAvatar :id="item.usedBy.id" class="mr-1" :size="50" :avatar-uploaded-at="item.usedBy.avatarUploadedAt" />
          {{ item.usedBy.name }}
        </v-layout>
        <span v-else>{{ item.usedByText }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";
import { formatDate } from "~/utils";

import CharacterAvatar from "~/components/CharacterAvatar.vue";
import IconBtn from "~/components/IconBtn.vue";
import QRCodeCreateDialog from "~/components/QRCodeCreateDialog.vue";

export interface QRCode {
  id: number;
  createdAt: number;
  code: string;
  usedBy?: {
    id: number;
    name: string;
    avatarUploadedAt: number;
  };
  usedAt?: number;
}

export interface FieldDescription {
  name: string;
  label: string;
  type: string;
}

@Component({
  components: {
    CharacterAvatar,
    IconBtn,
    QRCodeCreateDialog,
  },
  meta: {
    auth: true,
  },
})
export default class QRCodeEditor<T extends QRCode> extends Vue {
  @Prop({ type: String, default: "QR-коды" }) title!: string;
  @Prop({ type: String, default: "Создание QR-кода" }) createTitle!: string;
  @Prop({ type: Array, default: () => [] }) list!: T[];
  @Prop({ type: Function, default: () => null }) create!: (variables: object) => Promise<void>;
  @Prop({ type: Array, default: () => [] }) fields!: FieldDescription[];

  search = "";
  dialog = false;

  get headers() {
    return [
      { text: "ID", value: "id", width: 80 },
      { text: "Дата создания", value: "createdAtText", width: 180 },
      { text: "Код", value: "code", width: 170 },
      { text: "Кем использован", value: "usedByText" },
      { text: "Дата использования", value: "usedAtText", width: 180 },
      ...this.fields.map(f => ({ text: f.label, value: f.name })),
    ];
  }

  get items() {
    return this.list.map(item => ({
      ...item,
      createdAtText: formatDate(item.createdAt),
      usedByText: item.usedBy ? item.usedBy.name : "",
      usedAtText: item.usedAt ? formatDate(item.usedAt) : "",
    }));
  }

  get editable() {
    return [];
  }

  createQRCode() {
    this.dialog = true;
  }
}
</script>
