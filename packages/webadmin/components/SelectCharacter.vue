<template>
  <v-layout justify-center>
    <v-dialog :value="value === false" @input="$emit('input', $event ? false : null)" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Выберите персонажа</span>
        </v-card-title>
        <v-list>
          <template v-for="item in characters">
            <v-divider :key="'d' + item.id"></v-divider>
            <v-list-item :key="item.id" @click="$emit('input', item.id)">
              <v-list-item-content>
                <v-list-item-title class="d-flex" style="align-items: center">
                  <CharacterAvatar :id="item.id" class="mr-1" :size="50" :avatar-uploaded-at="item.avatarUploadedAt" />
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import CharacterAvatar from "@/components/CharacterAvatar.vue";

@Component({ components: { CharacterAvatar } })
export default class SelectCharacterDialog extends Vue {
  @Prop() value!: boolean | null | number;
  @Prop({ type: Array, default: () => [] }) characters!: { id: number; name: string; avatarUploadedAt: number }[];
}
</script>
