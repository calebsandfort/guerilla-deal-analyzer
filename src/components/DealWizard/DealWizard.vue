<template>
  <v-container fluid class="pa-0">
    <Toolbar back-path="/"></Toolbar>
    <v-content>
      <v-container
        v-if="!property && !dealWizardStore.finding"
        fluid
        grid-list-lg
      >
        <v-layout row>
          <v-flex xs12>
            <v-text-field label="Address" v-model="address">
              <template v-slot:append-outer>
                <v-icon @click="findPropertyClick" color="blue">send</v-icon>
              </template>
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container v-else-if="dealWizardStore.finding" fluid grid-list-lg>
        <v-layout row text-xs-center wrap>
          <v-flex xs12>
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid grid-list-lg class="pa-3">
        <v-layout row>
          <v-flex xs4>
            <v-layout v-if="property" row>
              <v-flex xs12>
                <PropertyDetails
                  ref="mainPropertyDetails"
                  v-on:show-gallery="showGallery"
                ></PropertyDetails>
              </v-flex>
            </v-layout>
            <v-layout row v-if="dealWizardStore.spotlightItem">
              <v-flex xs12>
                <PropertyDetails
                  ref="spotlightPropertyDetails"
                  :engagement="engagements.engagements.SPOTLIGHT.value"
                  field="spotlightItem"
                  v-on:show-gallery="showGallery"
                ></PropertyDetails>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs8 v-if="property && !dealWizardStore.finding">
            <v-card>
              <v-tabs color="pink" dark slider-color="yellow">
                <v-tab :key="1" ripple>
                  Comp Package
                </v-tab>
                <v-tab :key="2" ripple>
                  Rehab Estimate
                </v-tab>
                <v-tab :key="3" ripple>
                  Deal Analysis
                </v-tab>
                <v-tab :key="4" ripple>
                  Report
                </v-tab>
                <v-tab-item :key="1">
                  <v-container
                    v-if="
                      dealWizardStore.finding ||
                        dealWizardStore.setPullingCompsFromCache
                    "
                    fluid
                    grid-list-lg
                  >
                    <v-layout row text-xs-center wrap>
                      <v-flex xs12>
                        <v-progress-linear
                          :indeterminate="true"
                        ></v-progress-linear>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <CompLog
                    v-else-if="
                      dealWizardStore.finding || dealWizardStore.findingComps
                    "
                  ></CompLog>
                  <CompPackage v-else></CompPackage>
                </v-tab-item>
                <v-tab-item :key="2">
                  <RepairEstimator></RepairEstimator>
                </v-tab-item>
                <v-tab-item :key="3">
                  <v-container fluid grid-list-lg>
                    {{ property.streetPlusZip }}
                  </v-container>
                </v-tab-item>
                <v-tab-item :key="4">
                  <v-container fluid grid-list-lg>
                    {{ property.streetPlusZip }}
                  </v-container>
                </v-tab-item>
              </v-tabs>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <PropertyGallery
      ref="propertyGallery"
      v-on:closed="propertyGalleryClosed"
    ></PropertyGallery>
    <!--    <ScrapeFrame></ScrapeFrame>-->
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Toolbar from "../Toolbar";
import PropertyDetails from "./PropertyDetailsV2";
import CompPackage from "./CompPackage/CompPackageV2";
import RepairEstimator from "./RepairEstimator/RepairEstimator";
import PropertyGallery from "../Shared/PropertyGallery";
import { getRequestVariables as propertyRequest } from "../../api/property";
import * as engagements from "../../backend/enums/engagements";
import CompLog from "./CompPackage/CompLog";

export default {
  name: "DealWizard",
  components: {
    Toolbar,
    CompPackage,
    RepairEstimator,
    PropertyDetails,
    PropertyGallery,
    CompLog
  },
  data() {
    return {
      address: "11335 SE Pine St",
      activeGalleryRef: "",
      engagements: engagements
    };
  },
  computed: {
    propertyId() {
      return parseInt(this.$route.params.propertyId);
    },
    ...mapState({
      dealWizardStore: state => state.dealWizard,
      property: state => state.dealWizard.item
    })
  },
  created() {
    if (!isNaN(this.propertyId)) {
      const request = propertyRequest();
      request.id = this.propertyId;

      this.fetchProperty(request);
    }
  },
  methods: {
    ...mapActions({
      fetchProperty: "dealWizard/fetchItem",
      findProperty: "dealWizard/findProperty"
    }),
    findPropertyClick: function() {
      const request = propertyRequest();
      request.term = this.address;

      this.findProperty(request);
    },
    propertyGalleryClosed: function(lastIndex) {
      switch (this.activeGalleryRef) {
        case "item":
          this.$refs.mainPropertyDetails.setLastIndex(lastIndex);
          break;
        case "spotlightItem":
          this.$refs.spotlightPropertyDetails.setLastIndex(lastIndex);
          break;
      }
    },
    showGallery: function(args) {
      this.activeGalleryRef = args.ref;
      this.$refs.propertyGallery.open(args);
    }
  }
};
</script>

<style scoped></style>
