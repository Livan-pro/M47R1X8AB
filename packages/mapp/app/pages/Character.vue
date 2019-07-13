<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <CharacterAvatar :id="id" :size="200" />
        <Label :text="character.name" class="h1 text-center" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import gql from "graphql-tag";
import CharacterAvatar from "@/components/CharacterAvatar.vue";

@Component({
  components: { CharacterAvatar },
  apollo: {
    character: {
      query: gql`query($id: Int!) {
        character(id: $id) {
          id
          name
        }
      }`,
      variables() {
        return {
          id: (this as any).id,
        };
      },
      fetchPolicy: "cache-and-network",
    },
  },
})
export default class Character extends Vue {
  @Prop({type: Number, default: -1}) id!: number;
  character = {};
}
</script>

<style scoped>
</style>
