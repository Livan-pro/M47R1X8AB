<template>
  <Label class="fas" :text="code" />
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";

@Component
export default class Icon extends Vue {
  @Prop({ type: String, default: "\u0f128" }) code!: string;
}
</script>

<style scoped></style>
