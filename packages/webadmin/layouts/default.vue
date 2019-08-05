<template>
  <v-app>
    <GlobalSnackbar />
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app dark color="#00496a">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click="switchDark">
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
      <logout-button />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";
import GlobalSnackbar from "~/components/GlobalSnackbar.vue";
import LogoutButton from "~/components/LogoutButton.vue";

@Component({
  components: { GlobalSnackbar, LogoutButton },
  meta: {
    auth: true,
  },
})
export default class DefaultLayout extends Vue {
  clipped = true;
  fixed = true;
  items = [
    {
      icon: "mdi-apps",
      title: "Главная",
      to: "/",
    },
    {
      icon: "mdi-account-circle",
      title: "Пользователи",
      to: "/users",
    },
    {
      icon: "subject",
      title: "Новости",
      to: "/news",
    },
  ];
  title = "Matrix Webadmin";

  drawer = true;
  miniVariant = true;

  created() {
    this.$vuetify.theme.dark = localStorage.getItem("dark") === "true";
  }

  switchDark() {
    this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    localStorage.setItem("dark", this.$vuetify.theme.dark ? "true" : "false");
  }
}
</script>
