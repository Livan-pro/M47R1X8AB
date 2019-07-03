<template>
  <Page backgroundSpanUnderStatusBar="true">
    <ActionBar title="Вход в Матрицу" android:flat="true" />
    <StackLayout class="p-x-20" verticalAlignment="center">
      <ActivityIndicator :busy="loading" />
      <TextField v-model="login" hint="Логин" returnKeyType="next" />
      <TextField v-model="password" hint="Пароль" returnKeyType="done" secure="true" @returnPress="doLogin" />
      <Button text="Вход" @tap="doLogin" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import * as appSettings from "tns-core-modules/application-settings";
import App from "./App.vue";

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

@Component
export default class Login extends Vue {
  login = "";
  password = "";
  loading = false;

  async doLogin() {
    const login = this.login.toLowerCase();
    this.loading = true;
    await sleep(500);
    this.loading = false;
    if (login !== "a@a.a" || this.password !== "1") {
      await alert({
        title: "Ошибка",
        message: "Неверный логин или пароль",
        okButtonText: "ОК",
      });
      return;
    }

    appSettings.setString("token", "asd");
    this.$navigateTo(App);
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
