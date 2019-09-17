<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Импланты" class="h1 text-center" />
        <template v-for="(item, i) in implants">
          <StackLayout :key="'hr-' + i" class="hr-light m-b-10" />
          <ImplantItem :key="i" :data="item" />
        </template>
        <StackLayout class="hr-light" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import ImplantItem from "@/components/ImplantItem.vue";

import implants from "@/gql/Implants";
import { Implants_implants as Implant } from "@/gql/__generated__/Implants";

@Component({
  components: { ImplantItem },
  apollo: {
    implants,
  },
})
export default class ImplantsPage extends Vue {
  implants: Implant[] = [];
}
</script>

<style scoped></style>
