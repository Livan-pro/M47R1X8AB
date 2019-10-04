<template>
  <div class="text-center" id="main">
    <h1 id="title">Киберпанк <span class="purple">2219</span></h1>
    <div style="width: 100%">
      <h2 v-if="!started" class="yellow" id="standby">Please stand by<RollingDots/></h2>
      <hr>
      <h2 v-if="!started" id="countdown"><Countdown :timestamp="1570125600000"/></h2>
      <h2 v-else>Игра началась!</h2>
      <hr>
    </div>
    <img id="main-logo" src="@/assets/img/Cyberpunk_2219_round.png" alt="Cyberpunk 2219">
    <h3 class="mt-2 purple" id="vk-link"><span class="blink">></span> <a href="https://vk.com/cyberpunk_crimea">vk.com/cyberpunk_crimea</a></h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import RollingDots from "@/components/RollingDots.vue";
import Countdown from "@/components/Countdown.vue";

@Component({
  components: {RollingDots, Countdown},
})
export default class Index extends Vue {
  started = false;
  startTime = 1570168800000;
  created() {
    const wait = this.startTime - Date.now();
    if (wait <= 0) {
      this.started = true;
      return;
    }
    setTimeout(() => this.started = true, wait);
  }
}
</script>

<style lang="scss">
#title {
  font-size: 9vw;
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
  font-size: 14vw;
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
    font-size: 52px;
  }
  #standby {
    font-size: 43px;
  }
  #countdown {
    font-size: 80px;
  }
  #vk-link {
    font-size: 30px;
  }
}
</style>