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
      <b-form @submit.prevent="onSubmit(mutate)">
        <h2 class="text-center">Информация об игроке</h2>
        <universal-form ref="fUser" :form="userForm" :inputs="userInputs"/>
        <h2 class="text-center">Информация о персонаже</h2>
        <universal-form ref="fCharacter" :form="characterForm" :inputs="characterInputs"/>
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
import { CreateUser, CreateCharacter, validate } from "shared/browser";
import UniversalForm from "@/components/UniversalForm.vue";
import gql from "graphql-tag";
import { objectify } from "@/utils";

@Component({
  components: { UniversalForm },
})
export default class Register extends Vue {
  userForm = new CreateUser();
  characterForm = new CreateCharacter();
  done = false;

  checkVK(): boolean {
    if (this.userForm.vkId.startsWith("vk.com/")) this.userForm.vkId = this.userForm.vkId.substring(7);
    else if (this.userForm.vkId.startsWith("http://vk.com/")) this.userForm.vkId = this.userForm.vkId.substring(14);
    else if (this.userForm.vkId.startsWith("https://vk.com/")) this.userForm.vkId = this.userForm.vkId.substring(15);
    else if (this.userForm.vkId.length > 0 && this.userForm.vkId[0] >= "0" && this.userForm.vkId[0] <= "9") {
      this.userForm.vkId = "id" + this.userForm.vkId;
    }
    return true;
  }

  async validateForm(): Promise<boolean> {
    let valid = await (this.$refs.fUser as UniversalForm).validateAll();
    valid = await (this.$refs.fCharacter as UniversalForm).validateAll() && valid;
    return valid;
  }

  async onSubmit(mutate: () => void) {
    this.checkVK();
    if (await this.validateForm()) mutate();
  }

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
      vkId: "Ссылка или ID Вконтакте",
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
    };
  }
}
</script>