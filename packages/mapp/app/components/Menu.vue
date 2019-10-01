<template>
  <ListView for="item in items" :height="75 * items.length" @itemTap="onItemTap">
    <v-template>
      <Label class="p-y-20 text-center item-title hr-bottom" :class="{ 'item-disabled': item.disabled }" :text="item.title" />
    </v-template>
  </ListView>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue, { NativeScriptVueConstructor } from "nativescript-vue";

export interface MenuItem {
  title: string;
  disabled?: boolean;
  action?: () => void;
  open?: NativeScriptVueConstructor;
  modal?: NativeScriptVueConstructor;
  props?: object;
  fullscreen?: boolean;
}

@Component
export default class Menu extends Vue {
  @Prop({ type: Array, default: [] }) items: MenuItem[];

  async onItemTap({ item }: { item: MenuItem }) {
    if (item.disabled) return;
    if (item.action) await item.action.call(this);
    if (item.open) this.$navigateTo(item.open, { frame: this.$root.currentFrame, props: item.props });
    if (item.modal) this.$showModal(item.modal, { fullscreen: !!item.fullscreen, props: item.props });
  }
}
</script>

<style scoped>
.item-title {
  font-size: 24;
}

.item-disabled {
  color: gray;
}
</style>
