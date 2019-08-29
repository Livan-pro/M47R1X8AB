<template>
  <ApolloMutation
    :mutation="mutation"
  >
    <template slot-scope="{ mutate, loading, error, gqlError }">
      <b-alert v-if="errorMsg || gqlError || error" show variant="danger">
        {{ errorMsg || (gqlError ? gqlError.message :  gqlError) || error }}
      </b-alert>
      <b-form @submit.prevent="onSubmit(mutate)">
        <h2 class="text-center">Информация о персонаже</h2>
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
import { CreateCharacter, InitForm, professionOptions as options } from "shared/browser";
import gql from "graphql-tag";

const characterFieldsToTrim: (keyof CreateCharacter)[] = ["name"];

@Component({
  components: { UniversalForm },
})
export default class EditCharacter extends Vue {
  @Prop() initData!: any;
  @Prop({ type: Boolean, default: true }) loading!: boolean;
  form: CreateCharacter = InitForm(new CreateCharacter());
  errorMsg = "";

  created() {
    this.onLoadingChanged(this.loading);
  }

  @Watch("loading")
  onLoadingChanged(loading: boolean) {
    if (loading) return;
    this.form.name = this.initData.name;
    this.form.registrationProfession = this.initData.registrationProfession;
  }

  trimSpaces() {
    for (const key of characterFieldsToTrim) {
      if (typeof this.form[key] !== "string") continue;
      this.form[key] = this.form[key]!.trim();
    }
  }

  async validateForm(): Promise<boolean> {
    return await (this.$refs.form as UniversalForm).validateAll();
  }

  getChanges() {
    let changes = {};
    if (this.form.name !== this.initData.name) changes = {...changes, name: this.form.name};
    if (this.form.quenta) changes = {...changes, quenta: this.form.quenta};
    if (this.form.registrationProfession !== this.initData.registrationProfession) changes = {...changes, registrationProfession: this.form.registrationProfession};
    return changes;
  }

  async onSubmit(mutate: (options: any) => void) {
    this.trimSpaces();
    if (await this.validateForm()) {
      this.errorMsg = "";
      const variables = {
        characterId: this.initData.id,
        form: this.getChanges(),
      };
      mutate({variables});
    } else this.errorMsg = "Вы не заполнили некоторые поля!";
  }

  get mutation() {
    return gql`mutation($characterId: Int!, $form: CharacterInput!) {
      editCharacter(id: $characterId, character: $form)
    }`;
  }

  get inputs() {
    return {
      name: "Имя и фамилия",
      quenta: {label: "Квента", type: "file"},
      registrationProfession: {label: "Профессия", type: "select", options}
    };
  }
}
</script>