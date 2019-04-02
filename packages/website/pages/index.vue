<template>
  <div class="text-center" id="main">
    <h1 id="title">Киберпанк <span class="purple">2219</span></h1>
    <div>
      <h2 id="standby">Please stand by<RollingDots/></h2>
      <hr>
      <h2 id="countdown">05:18:28:19</h2>
      <hr>
    </div>
    <img id="main-logo" src="@/assets/img/Cyberpunk_2219_round.png" alt="Cyberpunk 2219">
    <h3 class="mt-2" id="vk-link"><span class="blink">></span> <a href="https://vk.com/cyberpunk_crimea">vk.com/cyberpunk_crimea</a></h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import RollingDots from "@/components/RollingDots.vue";

@Component({
  components: {RollingDots}
})
export default class Index extends Vue {
}
</script>

<style lang="scss">
#title {
  font-size: 10vw;
  margin-bottom: 0;
}
#main {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: space-evenly;
}
#standby {
  font-size: 8vw;
}
#countdown {
  font-size: 16vw;
  padding-bottom: 8px;
  margin: 0;
}
#main-logo {
  width: 50%;
}
#vk-link {
  font-size: 5.5vw;
}
@media screen and (min-width: 540px) {
  #title {
    font-size: 54px;
  }
  #standby {
    font-size: 43px;
  }
  #countdown {
    font-size: 86px;
  }
  #vk-link {
    font-size: 30px;
  }
}
</style>