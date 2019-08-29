<template>
  <ListView for="item in items" @itemTap="onItemTap">
    <v-template>
      <Label class="p-y-20 text-center item-title" :text="item.title" />
    </v-template>
  </ListView>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue, { NativeScriptVueConstructor } from "nativescript-vue";

export interface MenuItem {
  title: string;
  action?: () => void;
  open?: NativeScriptVueConstructor;
  modal?: NativeScriptVueConstructor;
  props?: object;
}

@Component
export default class Menu extends Vue {
  @Prop({ type: Array, default: [] }) items: MenuItem[];

  async onItemTap({ item }) {
    if (item.action) await item.action.call(this);
    if (item.open) this.$navigateTo(item.open, { frame: this.$root.currentFrame, props: item.props });
    if (item.modal) this.$showModal(item.modal, { props: item.props });
  }
}
</script>

<style scoped>
.item-title {
  font-size: 24;
}
</style>
