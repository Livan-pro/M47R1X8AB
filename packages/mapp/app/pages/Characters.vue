<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <Label :text="modal ? 'Выберите персонажа' : 'Персонажи'" class="text-center hr-bottom" :class="modal ? 'h2' : 'h1'" />
      <TextField v-model="search" hint="Поиск..." returnKeyType="done" />
      <StackLayout class="hr-light m-t-5" />
      <ListView for="item in items" height="100%" @itemTap="onTap">
        <v-template>
          <CharacterItem :data="item" class="hr-bottom p-y-10" />
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";

import CharacterItem from "@/components/CharacterItem.vue";
import CharacterPage from "@/pages/Character.vue";

import characters from "@/gql/Characters";
import { Characters_characters as Character } from "@/gql/__generated__/Characters";

@Component({
  components: { CharacterItem },
  apollo: {
    characters,
  },
})
export default class CharactersPage extends Vue {
  @Prop({ type: Boolean, default: false }) modal!: boolean;
  characters: Character[] = [];
  search = "";

  onTap({ item: { id } }: { item: { id: number } }) {
    if (this.modal) this.$modal.close(id);
    else this.$navigateTo(CharacterPage, { frame: this.$root.currentFrame, props: { id } });
  }

  get items() {
    return this.characters
      .filter(c => c.name.toLowerCase().includes(this.search.toLowerCase()))
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        return aName > bName ? 1 : aName < bName ? -1 : 0;
      });
  }
}
</script>

<style scoped></style>
