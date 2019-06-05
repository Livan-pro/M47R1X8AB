<template>
  <span>{{ dots }}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";

@Component
export default class RollingDots extends Vue {
  char = ".";
  dots = "...";
  intervalId: number = -1;
  @Prop({type: Number, default: 1}) min!: number;
  @Prop({type: Number, default: 3}) max!: number;
  @Prop({type: Number, default: 1000}) interval!: number;
  @Prop({type: Number, default: 3}) start!: number;

  created() {
    this.dots = this.char.repeat(this.start);
    this.intervalId = setInterval(this.onStep, this.interval) as any;
  }

  beforeDestroy() {
    clearInterval(this.intervalId);
  }

  onStep() {
    const len = this.dots.length + 1;
    if (len > this.max) this.dots = this.char.repeat(this.min);
    else this.dots += this.char;
  }
}
</script>