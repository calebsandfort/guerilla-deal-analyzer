<template>
  <v-container fluid class="px-0 pt-0">
    <Toolbar back-path="/"></Toolbar>
    <v-content>
      <v-container fluid v-if="dealWizardStore.finding">
        <v-layout row text-xs-center wrap>
          <v-flex xs12>
            <v-progress-circular
              :width="7"
              :size="70"
              color="green"
              indeterminate
            ></v-progress-circular>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container v-if="!property" fluid grid-list-lg>
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
      <v-container v-else-if="property && !dealWizardStore.finding" fluid grid-list-lg>
        <v-layout row>
          <v-flex xs4>
            <PropertyDetails></PropertyDetails>
          </v-flex>
          <v-flex xs8>
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
                  <CompPackage></CompPackage>
                </v-tab-item>
                <v-tab-item :key="2">
                  <v-container fluid grid-list-lg>
                    {{ property.streetPlusZip }}
                  </v-container>
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
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Toolbar from "../Toolbar";
import PropertyDetails from "./PropertyDetailsV2";
import CompPackage from "./CompPackageV2";
import { getRequestVariables as propertyRequest } from "../../api/property";

export default {
  name: "DealWizard",
  components: {
    Toolbar,
    CompPackage,
    PropertyDetails
  },
  data() {
    return {
      //address: "3521 N Michigan Ave"
      address: '4544 N Kerby Ave'
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
      findProperty: "dealWizard/findItem"
    }),
    findPropertyClick: function() {
      const request = propertyRequest();
      request.term = this.address;

      this.findProperty(request);
    }
  }
};
</script>

<style scoped></style>
