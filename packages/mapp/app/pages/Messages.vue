<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Сообщения" class="h1 text-center" />
        <StackLayout class="hr-light" />
        <Label text="Сообщения отключены" class="h2 text-center red m-t-10" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";

@Component
export default class MessagesPage extends Vue {}
</script>

<style scoped></style>
