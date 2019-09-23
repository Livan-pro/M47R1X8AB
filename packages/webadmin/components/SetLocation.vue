<template>
  <v-edit-dialog :return-value.sync="locId" @save="update" large cancel-text="Отменить" save-text="Сохранить">
    {{ locationName }}
    <template v-slot:input>
      <v-radio-group v-model="locId" hide-details>
        <v-radio v-for="loc in locations" :key="loc.value" :label="loc.text" :value="loc.value" />
      </v-radio-group>
    </template>
  </v-edit-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import SetLocationMutation from "~/gql/SetLocation";

@Component
export default class SetLocation extends Vue {
  @Prop({ type: Number, default: -1 }) characterId!: number;
  @Prop({ type: Number, default: -1 }) locationId!: number;
  @Prop({ type: String, default: "" }) locationName!: string;
  @Prop({ type: Array, default: () => [] }) locations!: { value: number; text: string }[];
  locId = -1;

  created() {
    this.updateLocId(this.locationId);
  }

  @Watch("locationId")
  updateLocId(locationId: number) {
    console.log(`updateLocId: ${this.locationId}`);
    this.locId = locationId;
  }

  async update() {
    await this.$apollo.mutate({ ...SetLocationMutation, variables: { id: this.characterId, locationId: this.locId } });
  }
}
</script>
