<template>
  <ScrollView>
    <StackLayout class="p-x-20 p-y-10">
      <Label text="Пользователи" class="h1 text-center" />
      <template v-for="i in 10">
        <StackLayout :key="'hr-' + i" class="hr-light m-b-10" />
        <UserItem :key="i" name="Test user" />
      </template>
      <StackLayout class="hr-light"></StackLayout>
    </StackLayout>
  </ScrollView>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import UserItem from "@/components/UserItem.vue";

@Component({
  components: { UserItem },
})
export default class Users extends Vue {
}
</script>

<style scoped>
</style>
