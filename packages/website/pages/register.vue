<template>
  <ApolloMutation
    v-if="!done"
    :mutation="mutation"
    :variables="variables"
    @done="done = true"
  >
    <template slot-scope="{ mutate, loading, error, gqlError }">
      <b-alert v-if="errorMsg || gqlError || error" show variant="danger">
        {{ errorMsg || gqlError.message || gqlError || error }}
      </b-alert>
      <b-form @submit.prevent="onSubmit(mutate)">
        <h2 class="text-center">Информация об игроке</h2>
        <universal-form ref="fUser" :form="userForm" :inputs="userInputs"/>
        <b-checkbox v-model="isAdult">Мне есть 18 лет</b-checkbox>
        <h2 class="text-center">Информация о персонаже</h2>
        <universal-form ref="fCharacter" :form="characterForm" :inputs="characterInputs"/>
        <div class="text-center">
          <b-button class="text-center" type="submit" variant="primary">Зарегистрироваться</b-button>
        </div>
      </b-form>
    </template>
  </ApolloMutation>
  <div v-else>
    <h2 class="mt-5 text-center">
      Спасибо за регистрацию!
    </h2>
    Данные об игроке и персонаже занесены в базу данных МГ.<br>
    Если у вас есть дополнительные вопросы или вы хотите исправить / дополнить информацию - обратитесь к <a class="purple" href="https://vk.com/tramplerr">мастеру игры</a>.<br>
    Следите за новостями проекта на наших ресурсах:<br>
    - <a class="purple" href="https://vk.com/cyberpunk_crimea">VK</a><br>
    - <a class="purple" href="https://cyberpunk2218.fandom.com/ru/wiki/Киберпанк2218">Wiki</a><br>
    До встречи на КИБЕРПАНК 2219<br>
    26-28.09.2019
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
  isAdult = false;
  errorMsg = "";

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
    if (!this.isAdult) {
      this.errorMsg = "Вам должно быть не менее 18 лет!";
      return;
    }
    this.checkVK();
    if (await this.validateForm()) {
      this.errorMsg = "";
      mutate();
    } else this.errorMsg = "Вы не заполнили некоторые поля!";
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