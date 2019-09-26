<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <Label text="Выберите персонажа" class="h2 text-center hr-bottom" />
      <ListView for="item in characters" height="100%" @itemTap="onTap">
        <v-template>
          <CharacterItem :data="item" class="hr-bottom p-y-10" />
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "@/components/CharacterItem.vue";

import Characters from "@/gql/Characters";
import { Characters_characters as Character } from "@/gql/__generated__/Characters";

@Component({
  components: { CharacterItem },
  apollo: {
    characters: Characters,
  },
})
export default class SelectCharacterModal extends Vue {
  characters: Character[] = [];

  onTap({ item: { id } }: { item: { id: number } }) {
    this.$modal.close(id);
  }
}
</script>

<style scoped></style>
