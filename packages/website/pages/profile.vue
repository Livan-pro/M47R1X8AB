<template>
  <div v-if="me">
    <h2 class="text-center">Информация об игроке</h2>
    Email: {{ me.email }}<br>
    Имя: {{ me.firstName }}<br>
    Фамилия: {{ me.lastName }}<br>
    Телефон: {{ me.phone }}<br>
    ID Вконтакте: {{ me.vkId }}<br>
    Аллергии, мед. показания: {{ me.medicalInfo }}<br>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import UniversalForm from "@/components/UniversalForm.vue";
import gql from "graphql-tag";
import {} from "vue-apollo/types/vue";
import {} from "@/vue-meta";

@Component({
  components: { UniversalForm },
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
        }
      }`,
      fetchPolicy: "cache-and-network",
    },
  },
})
export default class Profile extends Vue {
  me: any;
}
</script>