<template>
  <v-edit-dialog @save="save" large cancel-text="Отменить" save-text="Сохранить">
    {{ text }}
    <template v-slot:input>
      <v-menu v-model="dateMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
        <template v-slot:activator="{ on }">
          <v-text-field v-model="date" label="Дата" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="dateMenu = false"></v-date-picker>
      </v-menu>
      <v-menu
        ref="timeMenu"
        v-model="timeMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="time"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field v-model="time" label="Время" prepend-icon="mdi-clock-outline" readonly v-on="on"></v-text-field>
        </template>
        <v-time-picker
          v-if="timeMenu"
          v-model="time"
          full-width
          format="24hr"
          :use-seconds="true"
          @click:second="$refs.timeMenu.save(time)"
        ></v-time-picker>
      </v-menu>
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DateTimeEditDialog extends Vue {
  @Prop({ type: Date }) datetime!: Date;
  @Prop({ type: String, default: "" }) text!: string;
  dateMenu = false;
  date = this.datetime
    ? `${this.datetime.getFullYear()}-${(this.datetime.getMonth() + 1).toString().padStart(2, "0")}-${this.datetime
        .getDate()
        .toString()
        .padStart(2, "0")}`
    : null;
  timeMenu = false;
  time = this.datetime
    ? `${this.datetime
        .getHours()
        .toString()
        .padStart(2, "0")}:${this.datetime
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${this.datetime
        .getSeconds()
        .toString()
        .padStart(2, "0")}`
    : null;

  save() {
    if (!this.date || !this.time) return;
    const [year, month, date] = this.date.split("-").map(v => +v);
    const [hours, minutes, seconds] = this.time.split(":").map(v => +v);
    const datetime = new Date(year, month - 1, date, hours, minutes, seconds);
    this.$emit("save", datetime);
  }
}
</script>
