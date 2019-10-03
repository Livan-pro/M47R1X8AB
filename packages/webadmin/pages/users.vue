<template>
  <v-card>
    <set-password-dialog v-model="passwordDialog" :id="passwordData.id" :email="passwordData.email" />
    <v-card-title>
      Пользователи
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-search" label="Поиск" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :search="search" sort-by="id" class="elevation-1" multi-sort>
      <template v-for="edit in editable" v-slot:[`item.${edit.key}`]="{ item }">
        <v-edit-dialog :key="edit.key" :return-value.sync="item[edit.key]" @save="update(item.id, { [edit.key]: item[edit.key] })">
          {{ item[edit.key] }}
          <template v-slot:input>
            <v-text-field v-model="item[edit.key]" :rules="edit.rules" :label="edit.name" single-line counter></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.mainCharacter.name="{ item: { mainCharacter: value } }">
        <v-layout align-center>
          <CharacterAvatar :id="value.id" class="mr-1" :size="50" :avatar-uploaded-at="value.avatarUploadedAt" />
          {{ value.name }}
          <span v-if="value.quenta"
            >&nbsp;(<a target="_blank" download :href="dataUrl + '/quenta/' + value.id + '/' + value.quenta">квента</a>)
          </span>
        </v-layout>
      </template>
      <template v-slot:item.actions="{ item }">
        <make-admin-button v-if="isSuperAdmin" :id="item.id" :value="item.roles.includes('Admin')" />
        <upload-quenta-button :id="item.mainCharacter.id" />
        <icon-btn icon="mdi-lock-reset" color="orange" tooltip="Сменить пароль" @click="setPassword(item)" />
        <v-btn x-small text fab color="primary" :href="`https://vk.com/${item.vkId}`">
          VK
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import users from "~/gql/Users";
import me from "~/gql/MyRoles";
import { Users_users as User } from "~/gql/__generated__/Users";
import { MyRoles_me as Me } from "~/gql/__generated__/MyRoles";
import CharacterAvatar from "~/components/CharacterAvatar.vue";
import IconBtn from "~/components/IconBtn.vue";
import UploadQuentaButton from "~/components/UploadQuentaButton.vue";
import MakeAdminButton from "~/components/MakeAdminButton.vue";
import { UserRole as Role, EditUserInput } from "~/gql/__generated__/globalTypes";
import { dataUrl, maxChars, formatDate } from "@/utils";
import { professionToText } from "shared/browser";
import { createMutation } from "~/gql/UpdateUser";
import SetPasswordDialog from "~/components/SetPasswordDialog.vue";

@Component({
  components: { CharacterAvatar, IconBtn, UploadQuentaButton, MakeAdminButton, SetPasswordDialog },
  apollo: {
    users,
    me,
  },
  meta: {
    auth: true,
  },
})
export default class UsersPage extends Vue {
  users: User[] = [];
  me: Me = { __typename: "User", roles: [] };
  search = "";
  passwordDialog = false;
  passwordData = { id: -1, email: "" };

  get headers() {
    return [
      { text: "ID", value: "id" },
      { text: "Дата регистрации", value: "date" },
      { text: "Email", value: "email" },
      { text: "Имя", value: "firstName" },
      { text: "Фамилия", value: "lastName" },
      { text: "Телефон", value: "phone" },
      { text: "VK", value: "vkId" },
      { text: "Мед. информация", value: "medicalInfo" },
      { text: "Город", value: "city" },
      {
        text: "Персонаж",
        value: "mainCharacter.name",
      },
      {
        text: "Профессия",
        value: "mainCharacter.registrationProfessionText",
      },
      { value: "actions", sortable: false }, // width: 42 * buttons + 34
    ];
  }

  get items() {
    return this.users.map(u => ({
      ...u,
      mainCharacter: {
        ...u.mainCharacter,
        registrationProfessionText: u.mainCharacter && professionToText(u.mainCharacter.registrationProfession),
      },
      date: formatDate(u.createdAt),
    }));
  }

  get dataUrl() {
    return dataUrl;
  }

  get isSuperAdmin() {
    return this.me.roles && this.me.roles.includes(Role.SuperAdmin);
  }

  max255chars(str: string) {
    return str.length <= 255 || "Слишком длинная строка!";
  }

  get editable() {
    return [
      { key: "firstName", rules: [maxChars(255)], name: "Имя" },
      { key: "lastName", rules: [maxChars(255)], name: "Фамилия" },
      { key: "phone", rules: [maxChars(20)], name: "Телефон" },
      { key: "vkId", rules: [maxChars(32)], name: "VK ID" },
      { key: "medicalInfo", rules: [maxChars(1000)], name: "Мед. информация" },
      { key: "city", rules: [maxChars(32)], name: "Город" },
    ];
  }

  async update(id: number, data: EditUserInput) {
    await this.$apollo.mutate(createMutation(id, data));
  }

  setPassword(user: User) {
    this.passwordData = user;
    this.passwordDialog = true;
  }
}
</script>

<style lang="sass">
tr td:last-child
  width: 1%
  white-space: nowrap
</style>
