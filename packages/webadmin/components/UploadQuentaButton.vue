<template>
  <icon-btn tooltip="Загрузить квенту" icon="cloud_upload" :loading="loading" @click="uploadQuenta(id)" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import UploadQuenta, { createUpdate } from "~/gql/UploadQuenta";
import IconBtn from "~/components/IconBtn.vue";

@Component({
  components: { IconBtn },
})
export default class UploadQuentaButton extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  loading = false;

  uploadQuenta(id: number) {
    this.loading = true;
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e: Event) => {
      if (!e.target) return;
      const target = e.target as HTMLInputElement;
      if (!target.files || !target.files[0]) return;
      const file = target.files[0];
      try {
        await this.$apollo.mutate({ ...UploadQuenta, variables: { id, file }, update: createUpdate(id, file) });
        this.$root.$emit("snackbar", { text: "Квента загружена!", color: "success" });
      } catch (error) {
        this.$root.$emit("snackbar", {
          text: ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message,
          color: "error",
        });
      }
      this.loading = false;
    };
    input.click();
  }
}
</script>
