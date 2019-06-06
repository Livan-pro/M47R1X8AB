<template>
  <span>{{ days }}:{{ hours }}:{{ minutes }}:{{ seconds }}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";

@Component
export default class Countdown extends Vue {
  intervalId: number = -1;
  @Prop({type: Number, default: 0}) timestamp!: number;
  days = "00";
  hours = "00";
  minutes = "00";
  seconds = "00";

  created() {
    this.onStep();
    this.intervalId = setInterval(this.onStep, 1000) as any;
  }

  beforeDestroy() {
    clearInterval(this.intervalId);
  }

  onStep() {
    let t = Math.floor((this.timestamp - Date.now()) / 1000);
    this.days = this.pad(Math.floor(t / 86400));
    t = t % 86400;
    this.hours = this.pad(Math.floor(t / 3600));
    t = t % 3600;
    this.minutes = this.pad(Math.floor(t / 60));
    t = t % 60;
    this.seconds = this.pad(t);
  }

  pad(n: number, length = 2, char = "0") {
    return n.toString().padStart(length, char);
  }
}
</script>