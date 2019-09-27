<template>
  <StackLayout orientation="horizontal">
    <StackLayout>
      <Label :text="data.name" dock="left" class="h2" />
      <Label :text="typeText" dock="left" class="h3" />
      <Label :text="workingText" dock="left" class="h3" :class="data.working ? 'working' : 'not-working'" />
      <Label :text="qualityText" dock="left" class="h3" :class="data.quality ? 'good-quality' : 'bad-quality'" />
    </StackLayout>
  </StackLayout>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { getImplantTypeText } from "@/utils";
import { ImplantType } from "@/gql/__generated__/globalTypes";

@Component
export default class ImplantItem extends Vue {
  @Prop({ type: Object, default: {} }) data!: {
    id: number;
    name: string;
    type: ImplantType;
    working: boolean;
    quality: boolean;
  };

  get typeText() {
    return getImplantTypeText(this.data.type);
  }

  get workingText() {
    return this.data.working ? "Работает" : "Сломан";
  }

  get qualityText() {
    return this.data.quality ? "Качественный" : "Некачественный";
  }
}
</script>

<style scoped lang="scss">
.not-working {
  color: $red;
}
.working {
  color: $green;
}

.bad-quality {
  color: $red;
}
.good-quality {
  color: $green;
}
</style>
