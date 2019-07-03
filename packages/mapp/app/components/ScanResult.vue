<template>
  <GridLayout class="p-x-20 p-y-10" rows="*" columns="*">
    <ActivityIndicator v-if="loading" busy="true" />
    <Label v-else :text="'Результат: ' + result" />
  </GridLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";

@Component
export default class ScanResult extends Vue {
  @Prop({type: Boolean}) loading!: boolean;
  @Prop({type: String}) result!: string;
}
</script>

<style scoped>
StackLayout {
  height: 100%;
}
</style>
