<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <StackLayout class="p-x-20 p-y-10">
        <Label text="Загрузка аватара" class="h1 text-center" />
        <Button text="Выбрать изображение" @tap="select" />
        <Button class="m-t-10" text="Сделать фото" @tap="capture" />
        <template v-if="source">
          <Image class="m-t-10" :src="source" :width="200" :height="200" />
          <LoadingButton :loading="loading" class="m-t-10" text="Загрузить" @tap="upload" />
        </template>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "nativescript-vue";
import { ImageSource } from "tns-core-modules/image-source";
import * as imagepicker from "nativescript-imagepicker";
import * as camera from "nativescript-camera";
import { ImageCropper } from "nativescript-imagecropper";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";
import LoadingButton from "@/components/LoadingButton.vue";

import UploadAvatarM, { createUpdate } from "@/gql/UploadAvatar";

@Component({ components: { LoadingButton } })
export default class UploadAvatar extends Vue {
  @Prop({ type: Number, default: -1 }) id!: number;
  context: imagepicker.ImagePicker;
  source: ImageSource | null = null;
  loading = false;

  created() {
    this.context = imagepicker.create({ mode: "single" });
  }

  async select() {
    try {
      await this.context.authorize();
    } catch (err) {
      await alert({
        title: "Доступ к изображениям",
        message: "Вы должны разрешить доступ к изображениям, чтобы выбрать аватар для загрузки",
        okButtonText: "OK",
      });
    }

    const selected = await this.context.present();
    if (selected.length <= 0) return;
    await this.crop(selected[0]);
  }

  async capture() {
    try {
      await camera.requestCameraPermissions();
    } catch (err) {
      await alert({
        title: "Доступ к камере",
        message: "Вы должны разрешить доступ к камере, чтобы сделать фото",
        okButtonText: "OK",
      });
    }

    const img = await camera.takePicture({
      cameraFacing: "front",
    });
    await this.crop(img);
  }

  async crop(asset: ImageAsset) {
    const source = new ImageSource();
    await source.fromAsset(asset);
    const imageCropper = new ImageCropper();
    const args = await imageCropper.show(source, { width: 200, height: 200 });
    if (args.image !== null) this.source = args.image;
  }

  async upload() {
    this.loading = true;
    try {
      await this.$apollo.mutate({
        ...UploadAvatarM,
        variables: {
          id: this.id,
          avatar: this.source.toBase64String("png"),
        },
        update: createUpdate(this.id),
      });
      this.$navigateBack();
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(JSON.stringify(error));
      const message = ((error.graphQLErrors && error.graphQLErrors[0]) || error.networkError || error).message;
      await alert({
        title: "Ошибка",
        message,
        okButtonText: "ОК",
      });
    }
    this.loading = false;
  }
}
</script>

<style scoped></style>
