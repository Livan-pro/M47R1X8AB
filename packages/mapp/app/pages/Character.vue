<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <CharacterAvatar :id="id" :avatarUploadedAt="character.avatarUploadedAt" :size="200" @tap="onTap" />
        <Label :text="character.name" class="h1 text-center" :class="{own: character.own}" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import gql from "graphql-tag";
import CharacterAvatar from "@/components/CharacterAvatar.vue";
import UploadAvatar from "@/pages/UploadAvatar.vue";

@Component({
  components: { CharacterAvatar },
  apollo: {
    character: {
      query: gql`query($id: Int!) {
        character(id: $id) {
          id
          name
          own
          avatarUploadedAt
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
  character: any = {};

  onTap() {
    if (!this.character.own) return;
    this.$navigateTo(UploadAvatar, {frame: this.$root.currentFrame, props: {id: this.id}} as any);
  }
}
</script>

<style scoped lang="scss">
.own {
  color: $primary;
}
</style>
