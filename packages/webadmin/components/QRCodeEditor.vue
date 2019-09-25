<template>
  <v-card>
    <QRCodeCreateDialog v-model="dialog" :title="createTitle" :create="create" :fields="fields" />
    <QRCodeSettings v-model="settingsDialog" />
    <QRCodeDialog v-model="qrDialog" :text="getQrText(qrItem)" />
    <v-card-title>
      {{ title }}
      <icon-btn class="ml-2" icon="mdi-plus" color="green" tooltip="Создать" @click="createQRCode" />
      <icon-btn class="ml-2" icon="mdi-qrcode-edit" iconSize="16" color="orange" tooltip="Настройки" @click="settingsDialog = true" />
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
      <template v-slot:item.actions="{ item }">
        <icon-btn icon="mdi-qrcode" color="primary" tooltip="QR-код" @click="generateQRCode(item)" />
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
import QRCodeSettings from "~/components/QRCodeSettings.vue";
import QRCodeDialog from "~/components/QRCodeDialog.vue";

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
    QRCodeSettings,
    QRCodeDialog,
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
  @Prop({ type: Function, default: () => "" }) getQrText!: (item: T) => string;

  search = "";
  dialog = false;
  settingsDialog = false;
  qrDialog = false;
  qrItem: T | null = null;

  get headers() {
    return [
      { text: "ID", value: "id", width: 80 },
      { text: "Дата создания", value: "createdAtText", width: 180 },
      { text: "Код", value: "code", width: 170 },
      { text: "Кем использован", value: "usedByText" },
      { text: "Дата использования", value: "usedAtText", width: 180 },
      ...this.fields.map(f => ({ text: f.label, value: f.name })),
      { value: "actions", sortable: false },
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

  generateQRCode(item: T) {
    this.qrItem = item;
    this.qrDialog = true;
  }
}
</script>

<style lang="sass">
tr td:last-child
  width: 1%
  white-space: nowrap
</style>
