<template>
  <v-card>
    <v-card-title>
      Пользователи
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-search" label="Поиск" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="items" :search="search" sort-by="id" class="elevation-1" multi-sort>
      <template v-slot:item.createdAt="{ value }">
        {{ formatDate(value) }}
      </template>
      <template v-slot:item.vkId="{ value }">
        <a :href="'https://vk.com/' + value">{{ value }}</a>
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
import { UserRole as Role } from "../gql/__generated__/globalTypes";
import { dataUrl } from "@/utils";
import { characterRoleToText } from "shared/browser";

@Component({
  components: { CharacterAvatar, IconBtn, UploadQuentaButton, MakeAdminButton },
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

  get headers() {
    return [
      { text: "ID", value: "id" },
      { text: "Дата регистрации", value: "createdAt" },
      { text: "Email", value: "email" },
      { text: "Имя", value: "firstName" },
      { text: "Фамилия", value: "lastName" },
      { text: "Телефон", value: "phone" },
      { text: "VK", value: "vkId" },
      { text: "Мед. информация", value: "medicalInfo" },
      {
        text: "Персонаж",
        value: "mainCharacter.name",
      },
      {
        text: "Профессия",
        value: "mainCharacter.roleText",
      },
      { value: "actions", sortable: false }, // width: 42 * buttons + 34
    ];
  }

  get items() {
    return this.users.map(u => ({
      ...u,
      mainCharacter: {
        ...u.mainCharacter,
        roleText: u.mainCharacter && u.mainCharacter.roles && u.mainCharacter.roles.map(r => characterRoleToText(r)).join(", "),
      },
    }));
  }

  get dataUrl() {
    return dataUrl;
  }

  get isSuperAdmin() {
    return this.me.roles && this.me.roles.includes(Role.SuperAdmin);
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
