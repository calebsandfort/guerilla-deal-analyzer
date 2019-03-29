<template>
  <v-container fluid grid-list-lg>
    <v-layout row>
      <v-flex xs3>
        {{ editProperty.description }}
        <!--        <v-btn color="success" @click="test">Success</v-btn>-->
      </v-flex>
      <v-flex xs9>
        <v-container fluid grid-list-sm class="py-0">
          <v-layout row>
            <v-flex xs-12>
              <gallery
                :images="editProperty.image_urls_list"
                :index="galleryIndex"
                @close="index = null"
              ></gallery>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex
              v-for="(image, index) in editProperty.image_urls_list"
              xs2
              :key="`image_${editProperty.zillow_propertyId}_${index}`"
            >
              <img
                :src="image"
                class="image"
                width="100%"
                @click="galleryIndex = index"
              />
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs-12>
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs3>
        <v-select
          v-model="expandoUpdateProperty.mood"
          :items="moodItems"
          item-text="display"
          item-value="value"
          label="Mood"
        ></v-select>
      </v-flex>
      <v-flex xs9>
        <v-textarea
          name="notes"
          label="Notes"
          v-model="expandoUpdateProperty.notes"
          rows="4"
          outline
        ></v-textarea>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs-12 class="pt-0">
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs-12 text-xs-right>
        <v-btn color="success" @click="updateClick">Update</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import VueGallery from "vue-gallery";
import * as moods from "../../common/enums/moods";

export default {
  name: "ExpandoProperty",
  components: {
    gallery: VueGallery
  },
  props: {
    property: Object
  },
  data() {
    return {
      editProperty: this.property,
      expandoUpdateProperty: Object.assign(
        {},
        {
          id: this.property.id,
          mood: this.property.mood,
          notes: this.property.notes
        }
      ),
      galleryIndex: null,
      moodItems: moods.array()
    };
  },
  methods: {
    updateClick: function() {
      this.$emit("expando-update", this.expandoUpdateProperty);
    }
  }
};
</script>

<style scoped></style>
