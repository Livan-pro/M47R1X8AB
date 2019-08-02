<template>
  <v-layout>
    <v-flex text-xs-center>
      Добро пожаловать!
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator";

@Component({
  meta: {
    auth: true,
  },
})
export default class IndexPage extends Vue {}
</script>
