<template>
  <v-card>
    <properties-dialog v-model="propertiesDialog" :id="propertiesCharacter.id" :name="propertiesCharacter.name" />
    <implants-dialog v-model="implantsDialog" :id="implantsCharacter.id" :name="implantsCharacter.name" />
    <inventory-dialog v-model="inventoryDialog" :id="inventoryCharacter.id" :name="inventoryCharacter.name" />
    <QRCodeSettings v-model="qrSettingsDialog" />
    <QRCodeDialog v-model="qrDialog" :text="qrText" />
    <v-card-title>
      Персонажи
      <icon-btn class="ml-2" icon="mdi-qrcode-edit" iconSize="16" color="orange" tooltip="Настройки" @click="qrSettingsDialog = true" />
      <v-spacer></v-spacer>
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
      <template v-slot:item.avatarUploadedAt="{ item }">
        <v-layout align-center>
          <CharacterAvatar :id="item.id" class="mr-1" :size="50" :avatar-uploaded-at="item.avatarUploadedAt" />
        </v-layout>
      </template>
      <template v-slot:item.rolesText="{ item }">
        <v-edit-dialog @save="update(item.id, { roles: item.roles })" large cancel-text="Отменить" save-text="Сохранить">
          {{ item.rolesText }}
          <template v-slot:input>
            <v-checkbox v-for="role in roleOptions" :key="role.value" v-model="item.roles" :label="role.text" :value="role.value" />
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.professionText="{ item }">
        <v-edit-dialog
          @save="update(item.id, { profession: item.profession, professionLevel: item.professionLevel })"
          large
          cancel-text="Отменить"
          save-text="Сохранить"
        >
          {{ item.professionText }} ({{ item.professionLevel }})
          <template v-slot:input>
            <v-radio-group v-model="item.profession" hide-details>
              <v-radio v-for="profession in professionOptions" :key="profession.value" :label="profession.text" :value="profession.value" />
            </v-radio-group>
            <v-text-field v-model.number="item.professionLevel" type="number" label="Уровень" hide-details />
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.registrationProfessionText="{ item }">
        <v-edit-dialog
          @save="update(item.id, { registrationProfession: item.registrationProfession })"
          large
          cancel-text="Отменить"
          save-text="Сохранить"
        >
          {{ item.registrationProfessionText }}
          <template v-slot:input>
            <v-radio-group v-model="item.registrationProfession" hide-details>
              <v-radio v-for="profession in professionOptions" :key="profession.value" :label="profession.text" :value="profession.value" />
            </v-radio-group>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.stateText="{ item }">
        <v-edit-dialog @save="update(item.id, { state: item.state })" large cancel-text="Отменить" save-text="Сохранить">
          {{ item.stateText }}
          <template v-slot:input>
            <v-radio-group v-model="item.state" hide-details>
              <v-radio v-for="state in stateOptions" :key="state.value" :label="state.text" :value="state.value" />
            </v-radio-group>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.implantsRejectTimeText="{ item }">
        <date-time-edit-dialog
          :datetime="item.implantsRejectTimeDate"
          :text="item.implantsRejectTimeText"
          @save="update(item.id, { implantsRejectTime: $event })"
        />
      </template>
      <template v-slot:item.balance="{ item }">
        <add-balance :id="item.id" :balance="item.balance" />
      </template>
      <template v-slot:item.quenta="{ item }">
        <v-layout align-center>
          <upload-quenta-button :id="item.id" />
          <a v-if="item.quenta" class="simple-link" target="_blank" download :href="dataUrl + '/quenta/' + item.id + '/' + item.quenta">
            <icon-btn icon="mdi-cloud-download" tooltip="Скачать квенту" color="green" />
          </a>
        </v-layout>
      </template>
      <template v-slot:item.locationText="{ item }">
        <set-location
          :characterId="item.id"
          :locationId="item.location ? item.location.id : null"
          :locationName="item.locationText"
          :locations="locationOptions"
        />
      </template>
      <template v-slot:item.actions="{ item }">
        <icon-btn icon="mdi-format-list-bulleted-square" tooltip="Свойства" color="blue" @click="openProperties(item)" />
        <icon-btn icon="mdi-expansion-card-variant" tooltip="Импланты" color="blue" @click="openImplants(item)" />
        <icon-btn icon="mdi-bag-personal-outline" tooltip="Инвентарь" color="blue" @click="openInventory(item)" />
        <icon-btn icon="mdi-qrcode" color="primary" tooltip="QR-код" @click="openQr(item)" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import characters from "~/gql/Characters";
import me from "~/gql/MyRoles";
import { Characters_characters as Character } from "~/gql/__generated__/Characters";
import { MyRoles_me as Me } from "~/gql/__generated__/MyRoles";
import CharacterAvatar from "~/components/CharacterAvatar.vue";
import IconBtn from "~/components/IconBtn.vue";
import UploadQuentaButton from "~/components/UploadQuentaButton.vue";
import { UserRole as Role, FullCharacterInput, CharacterState } from "~/gql/__generated__/globalTypes";
import { dataUrl, maxChars, characterRolesToText, characterRoleOptions, stateOptions, formatDate } from "@/utils";
import { createMutation } from "~/gql/UpdateCharacter";
import { professionToText, professionOptions } from "shared/browser";
import AddBalance from "~/components/AddBalance.vue";
import DateTimeEditDialog from "~/components/DateTimeEditDialog.vue";
import PropertiesDialog from "~/components/PropertiesDialog.vue";
import locations from "~/gql/Locations";
import { Locations_locations as Location } from "~/gql/__generated__/Locations";
import SetLocation from "~/components/SetLocation.vue";
import ImplantsDialog from "~/components/ImplantsDialog.vue";
import InventoryDialog from "~/components/InventoryDialog.vue";
import QRCodeSettings from "~/components/QRCodeSettings.vue";
import QRCodeDialog from "~/components/QRCodeDialog.vue";

@Component({
  components: {
    CharacterAvatar,
    IconBtn,
    UploadQuentaButton,
    AddBalance,
    DateTimeEditDialog,
    PropertiesDialog,
    SetLocation,
    ImplantsDialog,
    InventoryDialog,
    QRCodeSettings,
    QRCodeDialog,
  },
  apollo: {
    characters,
    me,
    locations,
  },
  meta: {
    auth: true,
  },
})
export default class CharactersPage extends Vue {
  characters: Character[] = [];
  me: Me = { __typename: "User", roles: [] };
  locations: Location[] = [];

  search = "";
  propertiesDialog = false;
  propertiesCharacter = {};
  implantsDialog = false;
  implantsCharacter = {};
  inventoryDialog = false;
  inventoryCharacter = {};
  qrSettingsDialog = false;
  qrDialog = false;
  qrText = "";

  get headers() {
    return [
      { text: "ID", value: "id" },
      { text: "UserID", value: "userId" },
      { text: "Аватар", value: "avatarUploadedAt" },
      { text: "Имя", value: "name" },
      { text: "Квента", value: "quenta" },
      { text: "Роли", value: "rolesText" },
      { text: "Профессия", value: "professionText" },
      { text: "Проф. при рег.", value: "registrationProfessionText" },
      { text: "Баланс", value: "balance" },
      { text: "Состояние", value: "stateText" },
      { text: "Отторжение", value: "implantsRejectTimeText" },
      { text: "Прописка", value: "locationText" },
      { value: "actions", sortable: false }, // width: 42 * buttons + 34
    ];
  }

  get items() {
    return this.characters.map(c => {
      const implantsRejectTimeDate = c.implantsRejectTime ? new Date(c.implantsRejectTime) : null;
      const implantsRejectTimeText = implantsRejectTimeDate ? implantsRejectTimeDate.toLocaleString() : "Нет";
      return {
        ...c,
        rolesText: characterRolesToText(c.roles || []),
        professionText: professionToText(c.profession),
        registrationProfessionText: professionToText(c.registrationProfession),
        stateText: this.stateText(c),
        implantsRejectTimeDate,
        implantsRejectTimeText,
        locationText: (c.location && c.location.name) || "Нет",
      };
    });
  }

  get dataUrl() {
    return dataUrl;
  }

  get isSuperAdmin() {
    return this.me.roles && this.me.roles.includes(Role.SuperAdmin);
  }

  get editable() {
    return [{ key: "name", rules: [maxChars(255)], name: "Имя" }];
  }

  async update(id: number, data: FullCharacterInput) {
    await this.$apollo.mutate(createMutation(id, { ...data, pollution: undefined, deathTime: undefined }));
  }

  roleOptions = characterRoleOptions;
  professionOptions = professionOptions;
  stateOptions = stateOptions;

  stateText(char: Character) {
    if (char.state === CharacterState.Normal) return "Норма";
    if (char.state === CharacterState.Pollution) return `Загрязнение (${char.pollution})`;
    if (char.state === CharacterState.SevereWound) return `Тяжёлое ранение (${formatDate(char.deathTime)})`;
    if (char.state === CharacterState.Death) return `Смерть (${formatDate(char.deathTime)})`;
  }

  openProperties(char: Character) {
    this.propertiesCharacter = char;
    this.propertiesDialog = true;
  }

  openImplants(char: Character) {
    this.implantsCharacter = char;
    this.implantsDialog = true;
  }

  openInventory(char: Character) {
    this.inventoryCharacter = char;
    this.inventoryDialog = true;
  }

  openQr(char: Character) {
    this.qrText = `cbrpnk://c/${char.id}`;
    this.qrDialog = true;
  }

  get locationOptions() {
    return [{ value: -1, text: "Нет" }, ...this.locations.map(loc => ({ value: loc.id, text: loc.name }))];
  }
}
</script>

<style lang="sass">
tr td:last-child
  width: 1%
  white-space: nowrap
</style>
