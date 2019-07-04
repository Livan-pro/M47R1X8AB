<template>
  <div class="text-center">
    <FallingCoinsBackground/>
    <h2>Поздравляем!</h2>
    Вы выиграли приятный бонус в кредитах, который вы сможете получить на свой счёт с началом игры «КиберПанк 2219»<br>
    03-05 октября, Крым<br>
    <h3 class="mt-2 purple" id="vk-link"><span class="blink">></span> <a href="https://vk.com/cyberpunk_crimea">vk.com/cyberpunk_crimea</a></h3>
    СОХРАНИТЕ ЭТОТ ЖЕТОН С QR КОДОМ ДО ИГРЫ!
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";
import FallingCoinsBackground from "@/components/FallingCoinsBackground.vue";

@Component({
  components: { FallingCoinsBackground },
})
export default class Gift extends Vue {
}
</script>

<style scoped>
div {
  font-size: 24px;
}
</style>
