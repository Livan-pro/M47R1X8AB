<template>
  <Page>
    <ActionBar title="Матрица 2219" android:flat="true" />
    <TabView
      :key="tabsId"
      class="nav"
      androidTabsPosition="bottom"
      androidSelectedTabHighlightColor="#ffffff"
      :tabTextFontSize="20"
      :selectedIndex="selectedIndex"
      @selectedIndexChange="onSelectedIndexChange"
    >
      <TabViewItem v-for="tab in tabs" :key="tab.id" :class="tab.class" :title="tab.title">
        <Frame :id="tab.id" :key="tab.id">
          <component :is="tab.component" :ref="tab.ref" />
        </Frame>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Vue from "nativescript-vue";

import State from "./State.vue";
import News from "./News.vue";
import Characters from "./Characters.vue";
import Scan from "./Scan.vue";
import Menu from "./Menu.vue";

import me from "@/gql/MainCharacter";
import { MainCharacter_me as Me } from "@/gql/__generated__/MainCharacter";
import { CharacterState } from "@/gql/__generated__/globalTypes";

const tabCreator = (tabs: { title: string; component: string; id: string; class: string; ref: string }[]) => {
  let id = 0;
  return (condition: boolean, tab: { title: string; component: string }) => {
    if (condition) tabs.push({ ...tab, id: "f" + id, class: "fas", ref: tab.component.charAt(0).toLowerCase() + tab.component.slice(1) });
    ++id;
  };
};

@Component({
  components: { State, News, Characters, Scan, Menu },
  apollo: {
    me,
  },
})
export default class App extends Vue {
  me: Me = {
    __typename: "User",
    mainCharacter: {
      __typename: "Character",
      id: -1,
      name: "неизвестно",
      avatarUploadedAt: null,
      balance: 0,
      profession: null,
      professionLevel: null,
      state: CharacterState.Normal,
    },
  };

  selectedIndex: number = 0;

  onSelectedIndexChange({ value, oldValue }) {
    this.selectedIndex = value;
    this.$root.currentFrame = this.tabs[value].id;
    if (this.tabs[value].ref === "scan") this.scan(oldValue);
  }

  async scan(oldValue: number) {
    if (!(await (this.$refs.scan[0] as Scan).scan())) {
      process.nextTick(() => (this.selectedIndex = oldValue));
    }
  }

  get state() {
    return this.me.mainCharacter.state;
  }

  get tabs() {
    const tabs = [];
    const tab = tabCreator(tabs);
    const criticalState = this.state === CharacterState.SevereWound || this.state === CharacterState.Death;
    tab(criticalState, { title: "\uf491", component: "State" });
    tab(!criticalState, { title: "\uf1ea", component: "News" });
    tab(!criticalState, { title: "\uf0c0", component: "Characters" });
    tab(this.state !== CharacterState.Death, { title: "\uf029", component: "Scan" });
    tab(!criticalState, { title: "\uf0c9", component: "Menu" });
    return tabs;
  }

  get tabsId() {
    return this.tabs.reduce((id, tab) => id + tab.id, "tabs_");
  }
}
</script>

<style scoped></style>
