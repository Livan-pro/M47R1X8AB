<template>
  <div v-if="me">
    <h2 class="text-center">Информация об игроке</h2>
    Email: {{ me.email }}<br>
    Имя: {{ me.firstName }}<br>
    Фамилия: {{ me.lastName }}<br>
    Телефон: {{ me.phone }}<br>
    ID Вконтакте: {{ me.vkId }}<br>
    Аллергии, мед. показания: {{ me.medicalInfo }}<br>
    Город: {{ me.city }}<br>
    <br><br>
    <h2 class="text-center">Информация о персонаже</h2>
    Имя персонажа: {{ me.mainCharacter.name }}<br>
    Квента:
    <a v-if="me.mainCharacter.quenta" :href="quentaLink" download>скачать</a>
    <span v-else>не загружена</span><br>
    Профессия: {{ professionToText(me.mainCharacter.registrationProfession) }}
    <br>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import UniversalForm from "@/components/UniversalForm.vue";
import gql from "graphql-tag";
import { professionToText } from "shared/browser";
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
          city
          mainCharacter {
            id
            name
            quenta
            registrationProfession
          }
        }
      }`,
      fetchPolicy: "cache-and-network",
    },
  },
})
export default class Profile extends Vue {
  me: any;

  get quentaLink() {
    return `/data/quenta/${this.me.mainCharacter.id}/${this.me.mainCharacter.quenta}`;
  }

  professionToText = professionToText;
}
</script>