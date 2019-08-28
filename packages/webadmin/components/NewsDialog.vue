<template>
  <v-layout justify-center>
    <v-dialog :value="value" @input="$emit('input', $event)" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Заголовок" required v-model="form.title" :readonly="isEditDisabled" />
          <input-date label="Дата" v-model="form.datetime" :readonly="isEditDisabled" />
          <v-textarea label="Текст" v-model="form.text" :readonly="isEditDisabled" />
          <v-select v-model="attachment.type" :items="attachmentTypes" label="Тип вложения" />
          <v-file-input v-model="attachment.file" label="Файл вложения" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$emit('input', false)">Закрыть</v-btn>
          <v-btn :color="actionColor" text :loading="loading" @click="save">{{ type === "delete" ? "Удалить" : "Сохранить" }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import CreateNews from "~/gql/CreateNews";
import UpdateNews, { createUpdate as createUUpdate } from "~/gql/UpdateNews";
import DeleteNews, { createUpdate as createDUpdate } from "~/gql/DeleteNews";
import { News_news as News } from "../gql/__generated__/News";
import InputDate from "~/components/InputDate.vue";
import { NewsInput } from "../gql/__generated__/globalTypes";

@Component({
  components: { InputDate },
})
export default class NewsDialog extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  @Prop() data!: News;
  @Prop({ type: String, default: "create" }) type!: "create" | "update" | "delete";
  @Prop({ type: Boolean }) value!: boolean;
  loading = false;
  form: NewsInput = {
    title: "",
    datetime: new Date(),
    text: "",
  };
  attachment = {
    file: null,
    type: null,
  };

  get attachmentTypes() {
    return [{ text: "Картинка", value: "Image" }, { text: "Видео", value: "Video" }, { text: "Аудио", value: "Audio" }];
  }

  get title() {
    return {
      create: "Создание новости",
      update: `Редактирование новости (ID${this.id})`,
      delete: `Удаление новости (ID${this.id})`,
    }[this.type];
  }

  get isEditDisabled() {
    return this.type === "delete";
  }

  get actionColor() {
    return {
      create: "primary",
      update: "green",
      delete: "red",
    }[this.type];
  }

  @Watch("value")
  onValueChanged(value) {
    if (!value) return;
    if (this.type === "create") {
      this.form = {
        title: "",
        datetime: new Date(),
        text: "",
      };
      this.attachment = {
        file: null,
        type: null,
      };
    } else {
      this.form.title = this.data.title || "";
      this.form.datetime = this.data.datetime || new Date();
      this.form.text = this.data.text || "";
      this.attachment = {
        file: null,
        type: null,
      };
    }
  }

  async save() {
    this.loading = true;
    try {
      let data = { ...this.form };
      if (this.attachment.file && this.attachment.type) Object.assign(data, { attachment: this.attachment });
      if (this.type === "create") {
        await this.$apollo.mutate({ ...CreateNews, variables: { data } });
        this.$root.$emit("snackbar", { text: "Новость создана!", color: "success" });
      } else if (this.type === "update") {
        await this.$apollo.mutate({ ...UpdateNews, variables: { id: this.id, data }, update: createUUpdate(this.id, data) });
        this.$root.$emit("snackbar", { text: "Новость отредактирована!", color: "success" });
      } else if (this.type === "delete") {
        await this.$apollo.mutate({ ...DeleteNews, variables: { ids: [this.id] }, update: createDUpdate([this.id]) });
        this.$root.$emit("snackbar", { text: "Новость удалена!", color: "warning" });
      } else {
        console.error("Unknown type: " + this.type);
      }
    } catch (error) {
      this.$root.$emit("snackbar", {
        text: ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message,
        color: "error",
      });
    }
    this.$emit("input", false);
    this.loading = false;
  }
}
</script>
