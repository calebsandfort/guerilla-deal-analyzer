<template>
  <v-container fluid class="px-0 pt-0">
    <Toolbar back-path="/"></Toolbar>
    <v-content>
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
          Pretty Print
        </v-tab>
        <v-tab-item :key="1">
          <CompPackage :property="property"></CompPackage>
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
    </v-content>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Toolbar from "../Toolbar";
import CompPackage from "./CompPackage";
import { getRequestVariables as propertyRequest } from "../../api/property";

export default {
  name: "DealWizard",
  components: {
    Toolbar,
    CompPackage
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
    const request = propertyRequest();
    request.id = this.propertyId;

    this.fetchProperty(request);
  },
  methods: {
    ...mapActions({
      fetchProperty: "dealWizard/fetchItem"
    })
  }
};
</script>

<style scoped></style>
