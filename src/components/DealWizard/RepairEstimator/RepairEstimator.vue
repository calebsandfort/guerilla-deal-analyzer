<template>
  <v-container fluid grid-list-lg>
    <v-layout row>
      <v-flex xs8>
        <v-layout row>
          <v-flex shrink align-self-center>
            Quick Estimates
          </v-flex>
          <v-flex shrink>
            <v-switch :value="repairEstimate.quick" class="pl-4"></v-switch>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs4>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              name="repairEstimate.title"
              label="Title"
              :value="repairEstimate.title"
              v-on:keyup="fieldChangedText"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 v-if="repairEstimate.quick">
            <VuetifyNumeric
              field="repairEstimate.totalCost"
              label="Total"
              currency="$"
              :outline="true"
              :success="true"
              :value="repairEstimate.totalCost"
              v-on:input="fieldChangedNumber"
            >
            </VuetifyNumeric>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import * as utilities from "../../../backend/utilities/utilities";
import VuetifyNumeric from "../../Shared/VuetifyNumeric";

export default {
  name: "RepairEstimator",
  components: {
    VuetifyNumeric
  },
  mounted() {
    // const that = this;
    // that.compTableHeight = window.$(window).height() - 625;
    //
    // window.$(window).resize(
    //   _.debounce(function(args) {
    //     that.compTableHeight = window.$(window).height() - 625;
    //   })
    // );
  },
  computed: {
    ...mapState({
      dealWizardStore: state => state.dealWizard,
      repairEstimate: state => state.dealWizard.repairEstimate
    })
  },
  methods: {
    ...mapMutations({
      // setSpotlightComp: "dealWizard/setSpotlightItem",
      // setDealComps: "dealWizard/setDealComps"
    }),

    ...mapActions({
      setField: "dealWizard/setField"
      // findComps: "dealWizard/findComps"
    }),

    fieldChangedText: _.debounce(function(event) {
      this.setField({
        name: event.target.name,
        v: event.target.value
      });
    }, 250),

    fieldChangedNumber: _.debounce(function(args) {
      this.setField({
        name: args.field,
        v: args.value
      });
    }, 1000)
  }
};
</script>

<style scoped></style>
