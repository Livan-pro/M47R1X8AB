<template>
  <b-form-input v-bind="props" @input="val = $event" @blur="$emit('blur')"/>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";

@Component
export default class InputDate extends Vue {
  @Prop(String) id!: string;
  @Prop() state!: string | boolean | null;
  @Prop() value!: Date;

  get props() {
    return {...this.$props, type: "date", value: this.val};
  }

  get val() {
    if (this.value) {
      const d = this.value;
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    } else {
      return "";
    }
  }

  set val(val: string) {
    this.$emit("input", new Date(val));
  }
}
</script>