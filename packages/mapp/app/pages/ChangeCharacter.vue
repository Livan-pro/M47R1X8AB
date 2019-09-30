<template>
  <Page actionBarHidden="true">
    <StackLayout class="p-x-20 p-y-10">
      <Label text="Ваши персонажи" class="h1 text-center hr-bottom" />
      <ListView for="item in me.characters" height="100%" @itemTap="selectCharacter">
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

import me from "@/gql/MyCharacters";
import { MyCharacters_me as Me } from "@/gql/__generated__/MyCharacters";
import SetMainCharacter from "@/gql/SetMainCharacter";
import Menu from "@/pages/Menu.vue";
import State from "@/pages/State.vue";

@Component({
  components: { CharacterItem },
  apollo: {
    me,
  },
})
export default class ChangeCharacterPage extends Vue {
  me: Me = {
    __typename: "User",
    characters: [],
  };

  async selectCharacter({ item: { id } }: { item: { id: number } }) {
    const frame = this.$root.currentFrame;
    await this.$apollo.mutate({ ...SetMainCharacter, variables: { id } });
    this.$navigateTo(frame === "f4" ? Menu : State, { frame, clearHistory: true });
  }
}
</script>

<style scoped></style>
