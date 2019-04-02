<template>
  <ApolloMutation
    v-if="!done"
    :mutation="mutation"
    :variables="variables"
    @done="done = true"
  >
    <template slot-scope="{ mutate, loading, error }">
      <b-alert v-if="error" show variant="danger">
        {{ error }}
      </b-alert>
      <b-form @submit.prevent="mutate()">
        <h2 class="text-center">Информация об игроке</h2>
        <universal-form :form="userForm" :inputs="userInputs"/>
        <h2 class="text-center">Информация о персонаже</h2>
        <universal-form :form="characterForm" :inputs="characterInputs"/>
        <div class="text-center">
          <b-button class="text-center" type="submit" variant="primary">Зарегистрироваться</b-button>
        </div>
      </b-form>
    </template>
  </ApolloMutation>
  <div v-else>
    <h2 class="mt-5 text-center">Спасибо за регистрацию!</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import { CreateUser, CreateCharacter } from "shared";
import { validate } from "class-validator";
import UniversalForm from "@/components/UniversalForm.vue";
import gql from "graphql-tag";

const objectify = (obj: any, [k, v]: [string, any]) => (obj[k] = v, obj);


@Component({
  components: {UniversalForm}
})
export default class Register extends Vue {
  userForm = new CreateUser();
  characterForm = new CreateCharacter();
  done = false;

  get mutation() {
    return gql`mutation($userForm: UserInput!, $characterForm: CharacterInput!) {
      createUserWithCharacter(user: $userForm, character: $characterForm)
    }`;
  }

  get userInputs() {
    return {
      email: "Email",
      password: {label: "Пароль", type: "password"},
      passwordConfirmation: {label: "Подтверждение пароля", type: "password"},
      firstName: "Имя",
      lastName: "Фамилия",
      birthday: {label: "Дата рождения", type: "date"},
      phone: "Телефон",
      vkId: "ID Вконтакте",
      medicalInfo: "Аллергии, медицинские показания",
    };
  }

  get characterInputs() {
    return {
      name: "Имя и фамилия",
      age: {label: "Возраст", type: "number"},
      quenta: {label: "Квента", type: "file"},
    };
  }

  get variables() {
    return {
      userForm: this.userForm,
      characterForm: {...this.characterForm}, // {...} is needed for file uploads to work
    }
  }
}
</script>