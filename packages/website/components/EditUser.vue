<template>
  <ApolloMutation
    :mutation="mutation"
  >
    <template slot-scope="{ mutate, loading, error, gqlError }">
      <b-alert v-if="errorMsg || gqlError || error" show variant="danger">
        {{ errorMsg || (gqlError ? gqlError.message :  gqlError) || error }}
      </b-alert>
      <b-form @submit.prevent="onSubmit(mutate)">
        <h2 class="text-center">Информация об игроке</h2>
        <universal-form ref="form" :form="form" :inputs="inputs" :show-success="false" />
        <div class="text-center">
          <b-button class="text-center" :disabled="loading" type="submit" variant="primary">Сохранить</b-button>
        </div>
      </b-form>
    </template>
  </ApolloMutation>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "nuxt-property-decorator";
import UniversalForm from "@/components/UniversalForm.vue";
import { EditUser as EditUserForm, InitForm } from "shared/browser";
import gql from "graphql-tag";

const userFieldsToTrim: (keyof EditUserForm)[] = ["firstName", "lastName", "phone", "vkId", "medicalInfo"];

@Component({
  components: { UniversalForm },
})
export default class EditUser extends Vue {
  @Prop() initData!: any;
  @Prop({ type: Boolean, default: true }) loading!: boolean;

  form: EditUserForm = InitForm(new EditUserForm());
  errorMsg = "";

  created() {
    this.onLoadingChanged(this.loading);
  }

  @Watch("loading")
  onLoadingChanged(loading: boolean) {
    if (loading) return;
    for (const key in this.form) {
      if (!this.form.hasOwnProperty(key)) continue;
      if (!this.initData.hasOwnProperty(key)) continue;
      (this.form as any)[key] = this.initData[key];
    }
  }

  trimSpaces() {
    for (const key of userFieldsToTrim) {
      if (typeof this.form[key] !== "string") continue;
      this.form[key] = this.form[key]!.trim();
    }
  }

  checkVK() {
    if (!this.form.vkId) return;
    if (this.form.vkId.startsWith("vk.com/")) this.form.vkId = this.form.vkId.substring(7);
    else if (this.form.vkId.startsWith("http://vk.com/")) this.form.vkId = this.form.vkId.substring(14);
    else if (this.form.vkId.startsWith("https://vk.com/")) this.form.vkId = this.form.vkId.substring(15);
    else if (this.form.vkId.length > 0 && this.form.vkId[0] >= "0" && this.form.vkId[0] <= "9") {
      this.form.vkId = "id" + this.form.vkId;
    }
  }

  async validateForm(): Promise<boolean> {
    return await (this.$refs.form as UniversalForm).validateAll();
  }

  getChanges() {
    let changes = {};
    for (const key of Object.keys(this.form)) {
      if (!this.initData.hasOwnProperty(key) || this.initData[key] === (this.form as any)[key]) continue;
      changes = {...changes, [key]: (this.form as any)[key]};
    }
    return changes;
  }

  async onSubmit(mutate: (options: any) => void) {
    this.trimSpaces();
    this.checkVK();
    if (await this.validateForm()) {
      this.errorMsg = "";
      const variables = {
        form: this.getChanges(),
      };
      mutate({variables});
    } else this.errorMsg = "Вы не заполнили некоторые поля!";
  }

  get mutation() {
    return gql`mutation($form: EditUserInput!) {
      editUser(user: $form)
    }`;
  }

  get inputs() {
    return {
      firstName: "Имя",
      lastName: "Фамилия",
      phone: "Телефон",
      vkId: "Ссылка или ID Вконтакте",
      medicalInfo: "Аллергии, медицинские показания",
    };
  }
}
</script>