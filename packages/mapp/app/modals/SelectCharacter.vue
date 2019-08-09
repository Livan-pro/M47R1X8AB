<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Выберите персонажа" class="h2 text-center" />
        <template v-for="(item, i) in characters">
          <StackLayout :key="'hr-' + i" class="hr-light m-b-10" />
          <CharacterItem :key="i" :id="item.id" :avatarUploadedAt="item.avatarUploadedAt" :name="item.name" :own="item.own" @tap.prevent="onTap" />
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
          own
          avatarUploadedAt
        }
      }`,
      fetchPolicy: "cache-and-network",
    },
  },
})
export default class SelectCharacterModal extends Vue {
  characters = [];

  onTap({id}: {id: number}) {
    this.$modal.close(id);
  }
}
</script>

<style scoped>
</style>
