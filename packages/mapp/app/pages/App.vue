<template>
  <Page>
    <ActionBar title="Матрица 2219" android:flat="true" />
    <ActivityIndicator v-if="loading" busy="true" />
    <TabView
      v-else
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
          <component :is="tab.component" :ref="tab.ref" v-bind="tab.props" />
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

import me from "@/gql/MainCharacterWithSubscription";
import { MainCharacter_me as Me } from "@/gql/__generated__/MainCharacter";
import { CharacterState } from "@/gql/__generated__/globalTypes";

import { onMessage } from "../main";

const tabCreator = (
  tabs: { title: string; component: string; id: string; class: string; ref: string; props: Record<string, string | number | object> }[],
) => {
  let id = 0;
  return (condition: boolean, tab: { title: string; component: string; props?: Record<string, string | number | object> }) => {
    if (condition)
      tabs.push({ ...tab, id: "f" + id, class: "fas", ref: tab.component.charAt(0).toLowerCase() + tab.component.slice(1), props: tab.props || {} });
    ++id;
  };
};

@Component({
  components: { State, News, Characters, Scan, Menu },
  apollo: {
    me,
    $subscribe: {
      notifications: {
        ...NotoficationsSubscription,
        result(this: App, { data }) {
          onMessage(data.notifications);
        },
      },
    },
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
      pollution: 0,
      deathTime: null,
      implantsRejectTime: null,
      location: null,
    },
  };

  selectedIndex: number = 0;
  lastCriticalState: boolean | null = null;

  created() {
    this.$root.$on("selectTab", this.selectTab);
  }

  beforeDestroy() {
    this.$root.$off("selectTab", this.selectTab);
  }

  selectTab(id: number) {
    const idx = this.tabs.findIndex(tab => tab.id === `f${id}`);
    if (idx < 0) return;
    this.selectedIndex = idx;
  }

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
    tab(this.state !== CharacterState.Death, {
      title: "\uf029",
      component: "Scan",
      props: this.state === CharacterState.SevereWound ? { whitelist: ["mp"] } : {},
    });
    tab(!criticalState, { title: "\uf0c9", component: "Menu" });
    if (this.lastCriticalState !== criticalState) this.selectedIndex = 0;
    this.lastCriticalState = criticalState;
    return tabs;
  }

  get tabsId() {
    return this.tabs.reduce((id, tab) => id + tab.id, "tabs_");
  }

  get loading() {
    return this.me.mainCharacter.id === -1;
  }
}
</script>

<style scoped>
TabView {
  font-size: 20;
  tab-text-font-size: 20;
}
</style>
