<template>
  <div style="justify-self: center">
    <b-alert v-if="errorMsg" show variant="danger">
      {{ errorMsg }}
    </b-alert>
    <b-form @submit.prevent="login">
      <universal-form ref="form" :form="form" :inputs="inputs" :validation="false" />
      <div class="text-center">
        <b-button class="text-center" type="submit" variant="primary">Вход</b-button>
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import UniversalForm from "@/components/UniversalForm.vue";
import gql from "graphql-tag";
import { query } from "@/graphql/me";
import {} from "@/vue-meta";

@Component({
  components: { UniversalForm },
  meta: {
    auth: false,
  },
})
export default class Login extends Vue {
  form = {
    email: "",
    password: "",
    rememberMe: true,
  };
  errorMsg = "";
  loading = false;

  get mutation() {
    return ;
  }

  get inputs() {
    return {
      email: "Email",
      password: {label: "Пароль", type: "password"},
      rememberMe: {label: "Запомнить меня", type: "checkbox"},
    };
  }

  async login() {
    this.loading = true;
    try {
      await this.$apollo.mutate({
        mutation: gql`mutation($email: String!, $password: String!, $rememberMe: Boolean) {
          login(email: $email, password: $password, rememberMe: $rememberMe)
        }`,
        variables: this.form,
        update: (proxy: any, res: any) => {
          proxy.writeQuery({query, data: {
            me: {
              __typename: "User",
              email: res.data.login,
            },
          }});
        },
      });
      this.$router.push("/profile");
    } catch (error) {
      this.errorMsg = ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message;
    }
    this.loading = false;
  }
}
</script>