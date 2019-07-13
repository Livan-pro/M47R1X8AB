<template>
  <Page backgroundSpanUnderStatusBar="true">
    <ActionBar title="Вход в Матрицу" android:flat="true" />
    <StackLayout class="p-x-20" verticalAlignment="center">
      <Label :text="url" />
      <ActivityIndicator :busy="loading" />
      <TextField v-model="form.email" hint="Email" returnKeyType="next" />
      <TextField v-model="form.password" hint="Пароль" returnKeyType="done" secure="true" @returnPress="doLogin" />
      <Button text="Вход" @tap="doLogin" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import * as appSettings from "tns-core-modules/application-settings";
import App from "./App.vue";
import gql from "graphql-tag";
import { query } from "@/graphql/me";
import { login } from "@/vue-apollo";

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

@Component
export default class Login extends Vue {
  form = {
    email: "",
    password: "",
    rememberMe: true,
  };
  loading = false;

  get url() {
    return process.env.GRAPHQL_URL;
  }

  async doLogin() {
    this.loading = true;
    await sleep(500);
    this.loading = false;

    try {
      const result = await this.$apollo.mutate({
        mutation: gql`mutation($email: String!, $password: String!, $rememberMe: Boolean) {
          login(email: $email, password: $password, rememberMe: $rememberMe) {
            email
            token
          }
        }`,
        variables: this.form,
        update: (proxy: any, res: any) => {
          proxy.writeQuery({query, data: {
            me: {
              __typename: "User",
              email: res.data.login.email,
            },
          }});
        },
      });
      login(result.data.login.token);
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(JSON.stringify(error));
      const message = ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message;
      await alert({
        title: "Ошибка",
        message,
        okButtonText: "ОК",
      });
    }
  }
}
</script>

<style lang="scss" scoped>
TextField, Button {
  margin: 16px 0;
}

Button {
  font-size: 24px;
  // background-color: change-color(darken($primary, 30%), $alpha: 0.5);
  // android-elevation: 0;
}
</style>
