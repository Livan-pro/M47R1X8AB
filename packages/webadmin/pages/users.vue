<template>
  <v-card>
    <v-card-title>
      Пользователи
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Поиск" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="users" :search="search" sort-by="id" class="elevation-1" multi-sort>
      <template v-slot:item.createdAt="{ value }">
        {{ formatDate(value) }}
      </template>
      <template v-slot:item.vkId="{ value }">
        <a :href="'https://vk.com/' + value">{{ value }}</a>
      </template>
      <template v-slot:item.mainCharacter="{ value }">
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
import { Users_users as User, Users_users_mainCharacter as Character } from "~/gql/__generated__/Users";
import { MyRoles_me as Me } from "~/gql/__generated__/MyRoles";
import CharacterAvatar from "~/components/CharacterAvatar.vue";
import IconBtn from "~/components/IconBtn.vue";
import UploadQuentaButton from "~/components/UploadQuentaButton.vue";
import MakeAdminButton from "~/components/MakeAdminButton.vue";
import { Role } from "../gql/__generated__/globalTypes";

const dataUrl = process.env.ENV === "production" ? "https://cyberpunk2219.tech/data" : process.env.DATA_URL;

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
        value: "mainCharacter",
        filter: (value: Character, search: string) => value.name.toLowerCase().includes(search.toLowerCase()),
        sort: (a: Character, b: Character) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          return aName < bName ? -1 : aName > bName ? 1 : 0;
        },
      },
      { value: "actions", sortable: false }, // width: 42 * buttons + 34
    ];
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
