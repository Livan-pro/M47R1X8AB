<template>
  <ActivityIndicator v-if="loading" busy="true" />
  <Button v-else :text="text" @tap="$emit('tap')" />
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";

@Component
export default class LoadingButton extends Vue {
  @Prop({ type: Boolean, default: false }) loading!: boolean;
  @Prop({ type: String, default: "" }) text!: string;
}
</script>
