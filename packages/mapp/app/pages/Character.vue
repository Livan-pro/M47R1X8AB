<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <CharacterAvatar :id="id" :avatarUploadedAt="character.avatarUploadedAt" :size="200" :tap="onTap" />
        <Label :text="character.name" class="h1 text-center" :class="{ own: character.own }" />
        <Label :text="profession" class="h2 text-center" />
        <Label v-if="location" :text="location" class="h2 text-center" />
        <StackLayout class="hr-light m-t-10" />
        <Label :text="stateText" :class="color" class="h1 text-center p-y-10 hr-bottom" />
        <Button class="m-t-10" text="Отправить деньги" @tap="sendMoney" />
        <Button text="Отправить предмет" class="m-t-10" @tap="sendItem" />
        <Button v-if="isMedic" text="Экран медика" class="m-t-10" @tap="openMedic" />
        <template v-if="properties.length || canEditProperty">
          <StackLayout class="hr-light m-y-10" />
          <Label text="Свойства" class="h2 text-center" />
          <StackLayout class="hr-light m-t-10" />
          <StackLayout class="m-b-10">
            <Label
              v-for="prop in properties"
              :key="prop.name"
              class="p-y-20 text-center hr-bottom"
              :text="`${prop.name}: ${prop.value}`"
              textWrap="true"
              @itemTap="onPropertyTap(prop)"
            />
          </StackLayout>
          <Button v-if="canEditProperty" text="Добавить" @tap="addProperty" />
        </template>
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

import CharacterInfoById from "@/gql/CharacterInfoById";
import CharacterAdditionalInfoById from "@/gql/CharacterAdditionalInfoById";
import { CharacterInfoById_character as Character } from "@/gql/__generated__/CharacterInfoById";
import {
  CharacterAdditionalInfoById_addinfo as AddInfo,
  CharacterAdditionalInfoById_addinfo_properties as Property,
} from "@/gql/__generated__/CharacterAdditionalInfoById";
import me from "@/gql/MyRoles";
import { MyRoles_me as MyRoles } from "@/gql/__generated__/MyRoles";

import { getProfessionText, stateColor, stateText } from "../utils";
import { UserRole, CharacterRole, Profession, CharacterState } from "@/gql/__generated__/globalTypes";
import EditPropertyModal from "@/modals/EditProperty.vue";
import MoneyTransferAmount from "@/modals/MoneyTransferAmount.vue";
import SelectItem from "@/modals/SelectItem.vue";
import ItemTransferAmount from "@/modals/ItemTransferAmount.vue";

@Component({
  components: { CharacterAvatar },
  apollo: {
    character: {
      ...CharacterInfoById,
      variables(this: CharacterPage) {
        return {
          id: this.id,
        };
      },
      skip(this: CharacterPage) {
        return this.id < 0;
      },
    },
    addinfo: {
      ...CharacterAdditionalInfoById,
      variables(this: CharacterPage) {
        return {
          id: this.id,
        };
      },
      skip(this: CharacterPage) {
        return this.id < 0;
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
  };
  addinfo: AddInfo = {
    __typename: "Character",
    id: -1,
    state: CharacterState.Normal,
    location: null,
    properties: [],
  };
  me: MyRoles = {
    __typename: "User",
    mainCharacter: {
      __typename: "Character",
      id: -1,
      roles: [],
      profession: Profession.None,
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

  async sendMoney() {
    await this.$showModal(MoneyTransferAmount, { props: { id: this.id } });
  }

  async sendItem() {
    const itemId = await this.$showModal(SelectItem, { fullscreen: true });
    if (typeof itemId !== "number") return;
    await this.$showModal(ItemTransferAmount, { props: { characterId: this.id, itemId } });
  }

  async onPropertyTap(item: Property) {
    if (!this.canEditProperty) return;
    await this.$showModal(EditPropertyModal, { props: { id: this.id, name: item.name, value: item.value }, fullscreen: true });
  }
  async addProperty() {
    await this.$showModal(EditPropertyModal, { props: { id: this.id }, fullscreen: true });
  }

  get isMedic() {
    return (
      this.me.roles.includes(UserRole.Admin) ||
      (this.me.mainCharacter.id !== this.character.id &&
        (this.me.mainCharacter.profession === Profession.Biotechnician || this.me.mainCharacter.roles.includes(CharacterRole.Medic)))
    );
  }

  get profession() {
    return getProfessionText(this.character.profession, this.character.professionLevel);
  }

  get location() {
    return this.addinfo.location && this.addinfo.location.name && `Прописка: ${this.addinfo.location.name}`;
  }

  get properties() {
    return this.addinfo.properties;
  }

  get canEditProperty() {
    return this.me.roles.includes(UserRole.Admin) || this.me.mainCharacter.profession === Profession.Marshal;
  }

  get stateText() {
    const state = this.addinfo.state === CharacterState.Pollution ? CharacterState.Normal : this.addinfo.state;
    return stateText[state];
  }

  get color() {
    return stateColor[this.addinfo.state];
  }
}
</script>

<style scoped lang="scss">
.own {
  color: $primary;
}
</style>
