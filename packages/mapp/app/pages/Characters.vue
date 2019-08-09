<template>
  <Page action-bar-hidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Персонажи" class="h1 text-center" />
        <template v-for="(item, i) in characters">
          <StackLayout :key="'hr-' + i" class="hr-light m-b-10" />
          <CharacterItem :id="item.id" :key="i" :avatar-uploaded-at="item.avatarUploadedAt" :name="item.name" :own="item.own" />
        </template>
        <StackLayout class="hr-light" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterItem from "@/components/CharacterItem.vue";

import characters from "@/gql/Characters";
import { Characters_characters as Character } from "@/gql/__generated__/Characters";

@Component({
  components: { CharacterItem },
  apollo: {
    characters,
  },
})
export default class CharactersPage extends Vue {
  characters: Character[] = [];
}
</script>

<style scoped></style>
