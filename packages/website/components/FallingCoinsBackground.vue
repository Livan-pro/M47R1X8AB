<template>
  <div class="overlay">
    <img v-for="i in 50" :key="i" src="@/assets/img/coin.gif">
  </div>  
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component
export default class FallingCoinsBackground extends Vue {
}
</script>

<style lang="scss" scoped>
.overlay {
  z-index: -100;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.75;
}

img {
  height: 40px;
  position: absolute;
  top:-100vh;
  animation: 5s fall cubic-bezier(.62,.21,.91,.41) infinite;
}

@for $i from 1 through 50 {
  img:nth-child(#{$i}) {
    left: random() * 100 + vw;
    $duration: random() * 2 + 9;
    animation-duration: $duration + s;
    animation-delay: -(random() * $duration) + s;
  }
}

@keyframes fall {
  100% { transform: translateY(200vh); }
}
</style>
