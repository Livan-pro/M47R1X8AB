<template>
  <v-card class="elevation-12">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Авторизация</v-toolbar-title>
    </v-toolbar>
    <v-form @submit.prevent="login">
      <v-card-text>
        <v-alert v-if="errorMsg" value="true" type="error">
          {{ errorMsg }}
        </v-alert>
        <v-text-field v-model="form.email" prepend-icon="mdi-account" label="Логин" type="text" />
        <v-text-field v-model="form.password" prepend-icon="mdi-lock" label="Пароль" type="password" />
        <v-checkbox v-model="form.rememberMe" label="Запомнить меня" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" type="submit">
          Вход
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import Login from "~/gql/Login";

@Component({
  layout: "auth",
  meta: {
    auth: false,
  },
})
export default class LoginPage extends Vue {
  form = {
    email: "",
    password: "",
    rememberMe: true,
  };

  errorMsg = "";
  loading = false;

  async login() {
    this.loading = true;
    try {
      await this.$apollo.mutate({ ...Login, variables: this.form });
      this.$router.push("/");
    } catch (error) {
      this.errorMsg = ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message;
    }
    this.loading = false;
  }
}
</script>
