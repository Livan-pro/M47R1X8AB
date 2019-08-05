<template>
  <ApolloMutation
    :mutation="mutation"
    :variables="variables"
    :update="logout"
  >
    <template slot-scope="{ mutate, loading, error, gqlError }">
      <b-alert v-if="errorMsg || gqlError || error" show variant="danger">
        {{ errorMsg || (gqlError ? gqlError.message :  gqlError) || error }}
      </b-alert>
      <b-form @submit.prevent="onSubmit(mutate)">
        <h2 class="text-center">Смена пароля</h2>
        <b-alert show variant="warning">
          Внимание! После смены пароля Вам необходимо будет заново войти!
        </b-alert>
        <universal-form ref="form" :form="form" :inputs="inputs" :show-success="true" />
        <div class="text-center">
          <b-button class="text-center" :disabled="loading" type="submit" variant="primary">Сохранить</b-button>
        </div>
      </b-form>
    </template>
  </ApolloMutation>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "nuxt-property-decorator";
import UniversalForm from "@/components/UniversalForm.vue";
import { ChangePassword, InitForm } from "shared/browser";
import gql from "graphql-tag";
import * as me from "@/graphql/me";

@Component({
  components: { UniversalForm },
})
export default class EditUser extends Vue {
  form: ChangePassword = InitForm(new ChangePassword());
  errorMsg = "";

  async validateForm(): Promise<boolean> {
    return await (this.$refs.form as UniversalForm).validateAll();
  }

  async onSubmit(mutate: () => void) {
    if (await this.validateForm()) {
      this.errorMsg = "";
      mutate();
    } else this.errorMsg = "Вы не заполнили некоторые поля!";
  }

  logout(proxy: any) {
    this.$router.push("/login");
    proxy.writeQuery({query: me.query, data: {
      me: null,
    }});
  }

  get mutation() {
    return gql`mutation($data: ChangePasswordInput!) {
      changePassword(data: $data)
    }`;
  }

  get variables() {
    return {
      data: this.form,
    };
  }

  get inputs() {
    return {
      currentPassword: {type: "password", label: "Текущий пароль"},
      password: {type: "password", label: "Новый пароль"},
      passwordConfirmation: {type: "password", label: "Подтверждение пароля"},
    };
  }
}
</script>