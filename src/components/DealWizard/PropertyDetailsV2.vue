<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title
          v-bind:class="{
            'white--text py-2': true,
            red: engagement == engagements.engagements.ANALYSIS.value,
            blue: engagement == engagements.engagements.SPOTLIGHT.value
          }"
        >
          <div class="headline">{{ property.streetAddress }}</div>
        </v-card-title>
        <v-container fluid grid-list-sm class="pa-3">
          <v-layout row wrap>
            <v-flex xs5>
              <img :src="property.image_urls_list[0]" class="image" width="100%" @click="imgClick" style="cursor: pointer;" alt="Click for more pictures..." />
              <!--              <gallery-->
              <!--                ref="theGallery"-->
              <!--                :images="property.image_urls_list"-->
              <!--                :index="galleryIndex"-->
              <!--                @close="index = null"-->
              <!--                @onslideend="slideEnd"-->
              <!--              ></gallery>-->
            </v-flex>
            <v-flex xs7>
              <v-layout row wrap>
                <v-flex xs3 class="font-weight-medium">
                  Price
                </v-flex>
                <v-flex xs3>
                  {{ formatMoney(property.price, { precision: 0 }) }}
                </v-flex>
                <v-flex xs3 class="font-weight-medium">
                  sqft
                </v-flex>
                <v-flex xs3>
                  {{ formatNumber(property.sqft, { precision: 0 }) }}
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs3 class="font-weight-medium">
                  FIN sqft
                </v-flex>
                <v-flex xs3>
                  {{ formatNumber(property.finishedSqft, { precision: 0 }) }}
                </v-flex>
                <v-flex xs3 class="font-weight-medium">UNF sqft</v-flex>
                <v-flex xs3>
                  {{ formatNumber(property.unfinishedSqft, { precision: 0 }) }}
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs3 class="font-weight-medium">
                  Beds
                </v-flex>
                <v-flex xs3>
                  {{ property.beds }}
                </v-flex>
                <v-flex xs3 class="font-weight-medium">
                  Baths
                </v-flex>
                <v-flex xs3>
                  {{ property.baths }}
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs3 class="font-weight-medium">
                  Days On
                </v-flex>
                <v-flex xs3>
                  {{ property.days_listed }}
                </v-flex>
                <v-flex xs3 class="font-weight-medium">
                  Built
                </v-flex>
                <v-flex xs3>
                  {{ property.year_built }}
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs3 class="font-weight-medium">
                  Zestimate
                </v-flex>
                <v-flex xs3>
                  {{ formatMoney(property.zestimate, { precision: 0 }) }}
                </v-flex>
                <v-flex xs3 class="font-weight-medium">Ratio</v-flex>
                <v-flex xs3>
                  {{ formatNumber(property.price_to_zestimate, { precision: 2 }) }}
                </v-flex>
              </v-layout>
              <v-layout v-if="!mainProperty" row wrap>
                <v-flex xs3 class="font-weight-medium">
                  Keywords
                </v-flex>
                <v-flex xs9>
                  {{ property.keywords.join(", ") }}
                </v-flex>
              </v-layout>
              <v-layout v-if="mainProperty" row wrap>
                <v-flex xs3 class="font-weight-medium">
                  Links
                </v-flex>
                <v-flex xs9>
                  <v-icon title="Zillow" class="pr-2" style="cursor: pointer;" color="purple darken-2" @click="openInfoUrl(property.zillow_url)"
                    >open_in_new</v-icon
                  >
                  <improvements-dialog></improvements-dialog>
                  <permits-dialog></permits-dialog>
                  <!--                  <v-icon title="PortlandMaps" class="pr-2" style="cursor: pointer;" color="blue darken-2" @click="openInfoUrl(property.portlandmaps_url)"-->
                  <!--                    >map</v-icon-->
                  <!--                  >-->
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12>
              {{ property.description }}
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import VueGallery from "vue-gallery";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
import * as engagements from "../../backend/enums/engagements";
import ImprovementsDialog from "./CompPackage/ImprovementsDialog";
import PermitsDialog from "./CompPackage/PermitsDialog";

export default {
  name: "PropertyDetailsV2",
  components: {
    ImprovementsDialog,
    PermitsDialog
    // gallery: VueGallery
  },
  props: {
    field: {
      type: String,
      default: "item"
    },
    engagement: {
      type: Number,
      default: engagements.engagements.ANALYSIS.value
    },
    mainProperty: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      galleryIndex: null,
      lastIndex: 0,
      engagements: engagements
    };
  },
  computed: {
    ...mapState({
      dealWizardStore: state => state.dealWizard
      // property: state => state.dealWizard.item
    }),
    property: function() {
      return this.dealWizardStore[this.field];
    }
  },
  methods: {
    formatMoney: formatMoney,
    formatNumber: formatNumber,
    imgClick: function() {
      this.$emit("show-gallery", {
        lastIndex: this.lastIndex,
        image_urls_list: [...this.property.image_urls_list],
        ref: this.field
      });
      // this.$refs.theGallery.open(this.lastIndex);
    },
    setLastIndex: function(lastIndex) {
      this.lastIndex = lastIndex;
    },
    openInfoUrl: function(infoUrl) {
      console.log(infoUrl);
      window.open(infoUrl);
    }
    // slideEnd: function({ index }) {
    //   this.lastIndex = index;
    // }
  }
};
</script>

<style scoped></style>
