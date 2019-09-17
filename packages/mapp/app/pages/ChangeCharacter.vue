<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Ваши персонажи" class="h1 text-center" />
        <template v-for="(item, i) in me.characters">
          <StackLayout :key="'hr-' + i" class="hr-light m-b-10" />
          <CharacterItem :key="i" :data="item" @tap.prevent="selectCharacter(item.id)" />
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

import me from "@/gql/MyCharacters";
import { MyCharacters_me as Me } from "@/gql/__generated__/MyCharacters";
import SetMainCharacter from "@/gql/SetMainCharacter";
import MenuPage from "@/pages/Menu.vue";

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

  selectCharacter(id: number) {
    this.$apollo.mutate({ ...SetMainCharacter, variables: { id } });
  }
}
</script>

<style scoped></style>
