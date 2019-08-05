<template>
  <v-btn text :loading="loading" @click="logout">
    Выход
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Logout from "~/gql/Logout";

@Component
export default class LogoutButton extends Vue {
  loading = false;

  async logout() {
    this.loading = true;
    try {
      await this.$apollo.mutate(Logout);
      this.$router.push("/login");
    } catch (error) {
      this.$root.$emit("snackbar", {
        text: ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message,
        color: "error",
      });
    }
    this.loading = false;
  }
}
</script>
