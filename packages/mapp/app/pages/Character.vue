<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <CharacterAvatar :id="id" :avatarUploadedAt="character.avatarUploadedAt" :size="200" @tap="onTap" />
        <Label :text="character.name" class="h1 text-center" :class="{ own: character.own }" />
        <Label :text="profession" class="h2 text-center" />
        <Label v-if="location" :text="location" class="h2 text-center" />
        <Button v-if="isMedic" text="Экран медика" @tap="openMedic" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import CharacterAvatar from "@/components/CharacterAvatar.vue";
import UploadAvatar from "@/pages/UploadAvatar.vue";
import MedicPage from "@/pages/Medic.vue";

import CharacterById from "@/gql/CharacterById";
import { CharacterById_character as Character } from "@/gql/__generated__/CharacterById";
import me from "@/gql/MyRoles";
import { MyRoles_me as MyRoles } from "@/gql/__generated__/MyRoles";

import { getProfessionText } from "../utils";
import { UserRole, CharacterRole } from "@/gql/__generated__/globalTypes";

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
    me,
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
    location: null,
    implantsRejectTime: null,
  };
  me: MyRoles = {
    __typename: "User",
    mainCharacter: {
      __typename: "Character",
      id: -1,
      roles: [],
    },
    roles: [],
  };

  onTap() {
    if (!(this.character as Character).own) return;
    this.$navigateTo(UploadAvatar, { frame: this.$root.currentFrame, props: { id: this.id } });
  }

  openMedic() {
    this.$navigateTo(MedicPage, { frame: this.$root.currentFrame, props: { id: this.id } });
  }

  get isMedic() {
    return this.me.roles.includes(UserRole.Admin) || this.me.mainCharacter.roles.includes(CharacterRole.Medic);
  }

  get profession() {
    return getProfessionText(this.character.profession, this.character.professionLevel);
  }

  get location() {
    return this.character.location && this.character.location.name && `Прописка: ${this.character.location.name}`;
  }
}
</script>

<style scoped lang="scss">
.own {
  color: $primary;
}
</style>
