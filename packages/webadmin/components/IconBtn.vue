<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn small text icon :color="color" v-on="on" @click="$emit('click')">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class CharacterAvatar extends Vue {
  @Prop({ type: String }) icon!: string;
  @Prop({ type: String, default: "primary" }) color!: string;
  @Prop({ type: String, default: "" }) tooltip!: string;
}
</script>
