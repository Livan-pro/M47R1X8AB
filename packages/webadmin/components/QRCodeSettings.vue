<template>
  <v-layout justify-center>
    <v-dialog :value="value" @input="$emit('input', $event)" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Настройки генерации QR-кодов</span>
        </v-card-title>
        <v-card-text>
          <v-row v-for="opt in settingsDescription" :key="opt.name">
            <v-col cols="1" align-self="center">
              <v-checkbox v-model="settingsEnabled[opt.name]" hide-details class="single-line" />
            </v-col>
            <v-col cols="11">
              <v-text-field
                v-if="!opt.type || opt.type === 'number'"
                :label="opt.label"
                v-model="settings[opt.name]"
                :type="opt.type"
                :min="opt.min"
                :max="opt.max"
                required
                hide-details
                class="single-line"
              />
              <v-checkbox v-else-if="opt.type === 'boolean'" v-model="settings[opt.name]" :label="opt.label" hide-details class="single-line" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$emit('input', false)">Закрыть</v-btn>
          <v-btn color="success" text @click="save">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

const defaultSettings = {
  correctLevel: 1,
  size: 512,
  margin: 32,
  colorDark: "#000000",
  colorLight: "#ffffff",
  bgSrc: "",
  gifBgSrc: "",
  backgroundColor: "",
  logoSrc: "",
  logoScale: 0.2,
  logoMargin: 0,
  logoBackgroundColor: "",
  logoCornerRadius: 0,
  whiteMargin: true,
  dotScale: 0.35,
  autoColor: true,
  binarize: false,
  binarizeThreshold: 128,
};

const settingsDescription = [
  { name: "correctLevel", label: "Уровень коррекции (0-3)", type: "number", min: 0, max: 3 },
  { name: "size", label: "Размер изображения", type: "number", min: 32, max: 1024 },
  { name: "margin", label: "Отступ", type: "number", min: 0, max: 512 },
  { name: "colorDark", label: "Тёмный цвет" },
  { name: "colorLight", label: "Светлый цвет" },
  { name: "bgSrc", label: "URL фона" },
  { name: "gifBgSrc", label: "URL GIF-фона" },
  { name: "backgroundColor", label: "Цвет фона" },
  { name: "logoSrc", label: "URL логотипа" },
  { name: "logoScale", label: "Размер логотипа (0-1)", type: "number", min: 0, max: 1 },
  { name: "logoMargin", label: "Отступ логотипа", type: "number", min: 0, max: 512 },
  { name: "logoBackgroundColor", label: "Фон логотипа" },
  { name: "logoCornerRadius", label: "Радиус углов логотипа", type: "number" },
  { name: "whiteMargin", label: "Отступ фона", type: "boolean" },
  { name: "dotScale", label: "Размер точек (0-1)", type: "number", min: 0, max: 1 },
  { name: "autoColor", label: "Авто-выбор тёмного цвета по фону", type: "boolean" },
  { name: "binarize", label: "Бинаризация", type: "boolean" },
  { name: "binarizeThreshold", label: "Порог бинаризации", type: "number", min: 1, max: 254 },
];

@Component
export default class QRCodeSettings extends Vue {
  @Prop({ type: Boolean, default: false }) value!: boolean;
  settings = {};
  settingsEnabled = {};
  settingsDescription = settingsDescription;

  created() {
    this.settings = JSON.parse(localStorage.getItem("qrSettingsAll") || "{}");
    this.settingsEnabled = JSON.parse(localStorage.getItem("qrSettingsEnabled") || "{}");
    for (const { name } of this.settingsDescription) {
      if (!Object.hasOwnProperty.call(this.settings, name)) this.settings[name] = defaultSettings[name];
      if (!Object.hasOwnProperty.call(this.settingsEnabled, name)) this.settingsEnabled[name] = false;
    }
  }

  save() {
    localStorage.setItem("qrSettingsAll", JSON.stringify(this.settings));
    localStorage.setItem("qrSettingsEnabled", JSON.stringify(this.settingsEnabled));
    const settings = { ...this.settings };
    for (const { name, type } of this.settingsDescription) {
      if (!this.settingsEnabled[name]) delete settings[name];
      else if (type === "number") settings[name] = +settings[name];
    }
    localStorage.setItem("qrSettings", JSON.stringify(settings));
    this.$root.$emit("qrSettingsUpdate");
    this.$root.$emit("snackbar", { text: "Настройки сохранены!", color: "success" });
    this.$emit("input", false);
  }
}
</script>
