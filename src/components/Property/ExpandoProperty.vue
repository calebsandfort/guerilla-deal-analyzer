<template>
  <v-tabs color="pink" dark slider-color="yellow">
    <v-tab :key="1" ripple>
      Details
    </v-tab>
    <v-tab :key="2" ripple>
      Update
    </v-tab>
    <v-tab-item :key="1">
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
                  <gallery :images="editProperty.image_urls_list" :index="galleryIndex" @close="index = null"></gallery>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex v-for="(image, index) in editProperty.image_urls_list" xs2 :key="`image_${editProperty.zillow_propertyId}_${index}`">
                  <img :src="image" class="image" width="100%" @click="galleryIndex = index" />
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs3>
            <v-btn flat icon color="yellow darken-2" class="ma-1" @click="exploreClick">
              <v-icon>search</v-icon>
            </v-btn>
            <v-btn flat icon color="grey darken-2" class="ma-1" @click="ignoreClick">
              <v-icon>delete</v-icon>
            </v-btn>
            <v-btn flat icon color="blue darken-2" class="ma-1" @click="openTaxWindowClick">
              <v-icon>account_balance</v-icon>
            </v-btn>
            <v-btn flat icon color="green darken-2" class="ma-1" @click="openDealWizardClick">
              <v-icon>assignment</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-tab-item>
    <v-tab-item :key="2">
      <v-container fluid grid-list-lg>
        <v-layout row>
          <v-flex xs3>
            <v-select v-model="expandoUpdateProperty.status" :items="statusItems" item-text="display" item-value="value" label="Status"></v-select>
          </v-flex>
          <v-flex xs9>
            <v-textarea name="notes" label="Notes" v-model="expandoUpdateProperty.notes" rows="4" outline></v-textarea>
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
    </v-tab-item>
  </v-tabs>
</template>

<script>
import VueGallery from "vue-gallery";
import * as statuses from "../../backend/enums/statuses";

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
          status: this.property.status,
          notes: this.property.notes
        }
      ),
      galleryIndex: 0,
      statusItems: statuses.array()
    };
  },
  methods: {
    updateClick: function() {
      this.$emit("expando-update", this.property.id, this.expandoUpdateProperty);
    },
    exploreClick: function() {
      this.expandoUpdateProperty.status = statuses.statuses.EXPLORE.value;
      this.$emit("expando-update", this.property.id, this.expandoUpdateProperty);
    },
    ignoreClick: function() {
      this.expandoUpdateProperty.status = statuses.statuses.INGORE.value;
      this.$emit("expando-update", this.property.id, this.expandoUpdateProperty);
    },
    openDealWizardClick: function() {
      // let routeData = this.$router.resolve({
      //   name: "dealWizard"
      // });
      // window.open(`${routeData.href}/${this.property.id}`, "_blank");
      window.open(`/deal-wizard/${this.property.id}`, "_blank");
    },
    openTaxWindowClick: function() {
      window.open(`https://multcoproptax.com/Property-Search?searchtext=${this.property.streetAddress.replace(",", "").replace(".", "")}`, "_blank");
    }
  }
};
</script>

<style scoped></style>
