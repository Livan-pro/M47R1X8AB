<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Персонажи" class="h1 text-center" />
        <template v-for="(item, i) in characters">
          <StackLayout :key="'hr-' + i" class="hr-light m-b-10" />
          <CharacterItem :key="i" :id="item.id" :name="item.name" />
        </template>
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import gql from "graphql-tag";
import CharacterItem from "@/components/CharacterItem.vue";

@Component({
  components: { CharacterItem },
  apollo: {
    characters: {
      query: gql`{
        characters {
          id
          name
        }
      }`,
      fetchPolicy: "cache-and-network",
    },
  },
})
export default class Characters extends Vue {
  characters = [];
}
</script>

<style scoped>
</style>
