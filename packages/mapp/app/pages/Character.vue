<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <CharacterAvatar :id="id" :avatarUploadedAt="character.avatarUploadedAt" :size="200" @tap="onTap" />
        <Label :text="character.name" class="h1 text-center" :class="{ own: character.own }" />
        <Label :text="profession" class="h2 text-center" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterAvatar from "@/components/CharacterAvatar.vue";
import UploadAvatar from "@/pages/UploadAvatar.vue";

import CharacterById from "@/gql/CharacterById";
import { CharacterById_character as Character } from "@/gql/__generated__/CharacterById";
import { getProfessionText } from "../utils";

@Component({
  components: { CharacterAvatar },
  apollo: {
    character: {
      ...CharacterById,
      variables() {
        return {
          id: (this as CharacterPage).id,
        };
      },
    },
  },
})
export default class CharacterPage extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  character: Character = {
    __typename: "Character",
    id: -1,
    name: "неизвестно",
    own: false,
    avatarUploadedAt: null,
    profession: null,
    professionLevel: null,
  };

  onTap() {
    if (!(this.character as Character).own) return;
    this.$navigateTo(UploadAvatar, { frame: this.$root.currentFrame, props: { id: this.id } });
  }

  get profession() {
    return getProfessionText(this.character.profession, this.character.professionLevel);
  }
}
</script>

<style scoped lang="scss">
.own {
  color: $primary;
}
</style>
