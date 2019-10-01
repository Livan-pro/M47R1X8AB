<template>
  <Page backgroundSpanUnderStatusBar="true">
    <ActionBar title="Вход в Матрицу" android:flat="true" />
    <StackLayout class="p-x-20 p-t-30">
      <TextField v-model="form.email" hint="Email" returnKeyType="next" />
      <TextField v-model="form.password" hint="Пароль" returnKeyType="done" secure="true" @returnPress="doLogin" />
      <LoadingButton :loading="loading" text="Вход" @tap="doLogin" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { login } from "@/vue-apollo";

import Login from "@/gql/Login";
import { Login as LoginType } from "@/gql/__generated__/Login";

@Component({ components: { LoadingButton } })
export default class LoginPage extends Vue {
  form = {
    email: "",
    password: "",
    rememberMe: true,
  };
  loading = false;

  async doLogin() {
    this.loading = true;
    try {
      const result = await this.$apollo.mutate<LoginType>({
        ...Login,
        variables: this.form,
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
    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>
TextField,
button {
  margin: 16px 0;
}

button {
  font-size: 24px;
  // background-color: change-color(darken($primary, 30%), $alpha: 0.5);
  // android-elevation: 0;
}
</style>
