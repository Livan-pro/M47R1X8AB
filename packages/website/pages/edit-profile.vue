<template>
  <loading v-if="$apollo.loading" />
  <div v-else-if="me">
    <edit-user :init-data="me" :loading="loading" />
    <br><br>
    <edit-character :init-data="me.mainCharacter" :loading="loading" />
    <br><br>
    <change-password />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import gql from "graphql-tag";
import {} from "vue-apollo/types/vue";
import {} from "@/vue-meta";
import Loading from "@/components/Loading.vue";
import EditUser from "@/components/EditUser.vue";
import EditCharacter from "@/components/EditCharacter.vue";
import ChangePassword from "@/components/ChangePassword.vue";

@Component({
  components: { Loading, EditUser, EditCharacter, ChangePassword },
  meta: {
    auth: true,
  },
  apollo: {
    me: {
      query: gql`{
        me {
          email
          firstName
          lastName
          phone
          vkId
          medicalInfo
          city
          mainCharacter {
            id
            name
            quenta
            registrationProfession
          }
        }
      }`,
      fetchPolicy: "network-only",
      result() { (this as EditProfile).loading = false; },
    },
  },
})
export default class EditProfile extends Vue {
  me: any;
  loading = true;
}
</script>