<template>
  <component :is="tag">
    <template v-for="(input, i) in normalizedInputs">
      <b-checkbox
        v-if="input.type === 'checkbox'"
        :key="i"
        :id="'input' + input.name"
        v-model="form[input.name]"
        :state="state[input.name]"
        @blur="update(input.name)"
      >{{ input.label }}</b-checkbox>
      <b-form-group
        v-else
        :key="i"
        :label="input.label"
        :label-for="'input' + input.name"
        :state="state[input.name]"
        :invalid-feedback="errors[input.name]"
      >
        <input-date v-if="input.type === 'date'"
          :id="'input' + input.name"
          v-model="form[input.name]"
          :state="state[input.name]"
          @blur="update(input.name)"
        />
        <b-form-input v-else-if="input.type === 'number'"
          :id="'input' + input.name"
          :type="input.type"
          v-model.number="form[input.name]"
          :state="state[input.name]"
          @blur="update(input.name)"
        />
        <b-form-file v-else-if="input.type === 'file'"
          :id="'input' + input.name"
          :state="state[input.name]"
          @change="onFileChanged(input.name, $event)"
          @blur="update(input.name)"
          placeholder="Выберите файл..."
          drop-placeholder="Перетащите файл сюда..."
        />
        <b-form-select v-else-if="input.type === 'select'"
          :id="'input' + input.name"
          :options="input.options"
          v-model="form[input.name]"
          :state="state[input.name]"
          @blur="update(input.name)"></b-form-select>
        <b-form-input v-else
          :id="'input' + input.name"
          :type="input.type"
          v-model="form[input.name]"
          :state="state[input.name]"
          @blur="update(input.name)"
        />
      </b-form-group>
    </template>
  </component>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator";
import { validate } from "shared/browser";
import InputDate from "@/components/InputDate.vue";
import { objectify } from "@/utils";

interface IInputDefinition {
  name: string;
  label: string;
  type: string;
}

@Component({
  components: {InputDate},
})
export default class UniversalForm extends Vue {
  @Prop({type: String, default: "div"}) tag!: string;
  @Prop() form!: any;
  @Prop({default: []}) inputs!: any;
  @Prop({type: Boolean, default: true}) validation!: boolean;
  @Prop({type: Boolean, default: true}) hideUndefined!: boolean;
  @Prop({type: Boolean, default: true}) showSuccess!: boolean;
  dirty: {[key: string]: boolean} = Object.keys(this.form).map(k => [k, false]).reduce(objectify, {});
  errors: {[key: string]: string} = Object.keys(this.form).map(k => [k, ""]).reduce(objectify, {});
  state: {[key: string]: boolean | null} = Object.keys(this.form).map(k => [k, null]).reduce(objectify, {});

  get normalizedInputs(): IInputDefinition[] {
    if (this.hideUndefined) {
      return Object.keys(this.inputs).map(key => {
        let obj = {
          name: key,
          label: key,
          type: "text",
        };
        if (typeof this.inputs[key] === "string") {
          obj.label = this.inputs[key];
        } else {
          obj = {...obj, ...this.inputs[key]};
        }
        return obj;
      });
    } else {
      return Object.keys(this.form).map(key => {
        let obj = {
          name: key,
          label: key,
          type: "text",
        };
        if (this.inputs[key]) {
          if (typeof this.inputs[key] === "string") {
            obj.label = this.inputs[key];
          } else {
            obj = {...obj, ...this.inputs[key]};
          }
        }
        return obj;
      });
    }
  }

  onFileChanged(name: string, event: any) {
    this.form[name] = event.target.files[0];
  }

  async update(name: string) {
    if (!this.dirty[name]) this.dirty[name] = true;
    await this.validateForm();
  }

  markAllDirty() {
    for (const key of Object.keys(this.form)) this.dirty[key] = true;
  }

  async validateAll() {
    this.markAllDirty();
    return await this.validateForm();
  }

  async validateForm(): Promise<boolean> {
    if (!this.validation) return true;
    const errors = await validate(this.form);
    // Clear previous errors
    for (const key in this.errors) {
      if (!this.errors.hasOwnProperty(key)) continue;
      this.errors[key] = "";
      this.state[key] = this.showSuccess ? this.dirty[key] || null : null;
    }
    // Set errors
    for (const err of errors) {
      if (this.dirty[err.property]) {
        this.errors[err.property] = err.constraints.isNotEmpty || err.constraints[Object.keys(err.constraints)[0]];
        this.state[err.property] = false;
      }
    }
    return errors.length === 0;
  }
}
</script>

<style lang="scss">
</style>