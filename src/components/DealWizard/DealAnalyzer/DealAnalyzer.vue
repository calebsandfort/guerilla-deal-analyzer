<template>
  <v-container fluid grid-list-lg class="pa-3">
    <v-layout row wrap>
      <v-flex xs6 md3>
        <VuetifyNumeric
          field="arv,dealAnalysis.DF_ARV"
          label="ARV"
          currency="$"
          :value="dealAnalysis.DF_ARV"
          v-on:input="fieldChangedNumber"
        >
        </VuetifyNumeric>
      </v-flex>
      <v-flex xs6 md3>
        <VuetifyNumeric
          field="dealAnalysis.DF_RepairCosts"
          label="Repair Estimate"
          currency="$"
          :value="dealAnalysis.DF_RepairCosts"
          :readonly="true"
        >
        </VuetifyNumeric>
      </v-flex>
      <v-flex xs6 md3>
        <VuetifyNumeric
          field="dealAnalysis.SNAP_ROI"
          label="ROI"
          :precision="3"
          :value="dealAnalysis.SNAP_ROI"
          v-on:input="fieldChangedNumber"
        >
        </VuetifyNumeric>
      </v-flex>
      <v-flex xs6 md3>
        <VuetifyNumeric
          field="dealAnalysis.DF_PurchasePrice"
          label="Purchase"
          currency="$"
          :readonly="true"
          :precision="2"
          :value="dealAnalysis.DF_PurchasePrice"
        >
        </VuetifyNumeric>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs6 md3>
        <v-select
          :items="loanTypes.array()"
          item-text="display"
          item-value="value"
          :value="dealAnalysis.FC_LoanType"
          @input="setField({ name: 'FC_LoanType', v: $event })"
          label="Loan Type"
        ></v-select>
      </v-flex>
      <v-flex xs6 md3>
        <VuetifyNumeric
          field="dealAnalysis.FC_LoanAmount"
          label="Loan Amount"
          currency="$"
          :readonly="true"
          :precision="2"
          :value="dealAnalysis.FC_LoanAmount"
        >
        </VuetifyNumeric>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-expansion-panel>
          <template v-for="dealAnalysisSection in dealAnalysisSections">
            <v-expansion-panel-content
              :key="
                `dealAnalysisSection_${dealAnalysisSection.sectionType.value}`
              "
            >
              <template v-slot:header>
                <div>{{ dealAnalysisSection.sectionType.display }}</div>
              </template>
              <v-card>
                <v-card-text class="pt-0">
                  <DealAnalysisSection></DealAnalysisSection>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </template>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import VuetifyNumeric from "../../Shared/VuetifyNumeric";
import DealAnalysisSection from "./DealAnalysisSection";
import * as utilities from "../../../backend/utilities/utilities";
import * as loanTypes from "../../../backend/enums/loanTypes";

export default {
  name: "DealAnalyzer",
  components: {
    VuetifyNumeric,
    DealAnalysisSection
  },
  props: {},
  data() {
    return {
      loanTypes: loanTypes
    };
  },
  computed: {
    ...mapState({
      dealAnalysis: state => state.dealWizard.dealAnalysis,
      dealAnalysisSections: state => state.dealWizard.dealAnalysisSections
    })
    // example: function() {return {}}
  },
  watch: {
    // comps: function () {}
  },
  methods: {
    // ...mapMutations({
    //   example: "example/example",
    // }),
    ...mapActions({
      setField: "dealWizard/setField"
    }),
    fieldChangedNumber: _.debounce(function(args) {
      this.setField({
        name: args.field,
        v: args.value
      });
    }, 500),
    selectInput(e) {
      console.log(e);
    }
  }
};
</script>

<style scoped></style>
