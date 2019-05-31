<template>
  <v-container fluid grid-list-lg class="pa-3">
    <v-layout row wrap>
      <v-flex xs6 md3>
        <VuetifyNumeric field="arv,dealAnalysis.DF_ARV" label="ARV" currency="$" :value="dealAnalysis.DF_ARV" :precision="2" v-on:input="fieldChangedNumber">
        </VuetifyNumeric>
      </v-flex>
      <v-flex xs6 md3>
        <VuetifyNumeric
          field="dealAnalysis.DF_RepairCosts"
          label="Repair Estimate"
          currency="$"
          :value="dealAnalysis.DF_RepairCosts"
          :readonly="true"
          :precision="2"
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
      <v-flex xs6 md3>
        <VuetifyNumeric
          field="dealAnalysis.SNAP_ROI"
          label="ROI"
          :precision="2"
          currency="%"
          currency-symbol-position="suffix"
          :value="dealAnalysis.SNAP_ROI * 100"
          v-on:input="fieldChangedNumber"
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
          @input="setField({ name: 'dealAnalysis.FC_LoanType', v: $event })"
          label="Loan Type"
        ></v-select>
      </v-flex>
      <v-flex xs6 md3>
        <VuetifyNumeric field="dealAnalysis.DF_HoldTime" label="Hold Time" :value="dealAnalysis.DF_HoldTime" v-on:input="fieldChangedNumber"> </VuetifyNumeric>
      </v-flex>
      <v-flex xs6 md3>
        <VuetifyNumeric
          field="dealAnalysis.SNAP_TotalCost"
          label="Total Cost"
          currency="$"
          :readonly="true"
          :precision="2"
          :value="dealAnalysis.SNAP_TotalCost"
        >
        </VuetifyNumeric>
      </v-flex>
      <v-flex xs6 md3>
        <VuetifyNumeric field="dealAnalysis.SNAP_Profit" label="Profit" currency="$" :readonly="true" :precision="2" :value="dealAnalysis.SNAP_Profit">
        </VuetifyNumeric>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs6 md3>
        <VuetifyNumeric field="dealAnalysis.DF_Ask" label="Ask" currency="$" :precision="2" :value="dealAnalysis.DF_Ask" v-on:input="fieldChangedNumber">
        </VuetifyNumeric>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-expansion-panel>
          <template v-for="dealAnalysisSection in dealAnalysisSections">
            <DealAnalysisSection
              :key="`dealAnalysisSection_${dealAnalysisSection.sectionType.value}`"
              :deal-analysis-section="dealAnalysisSection"
            ></DealAnalysisSection>
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
import * as dealAnalysisSectionTypes from "../../../backend/enums/dealAnalysisSectionTypes";
import formatMoney from "accounting-js/lib/formatMoney";

export default {
  name: "DealAnalyzer",
  components: {
    VuetifyNumeric,
    DealAnalysisSection
  },
  props: {},
  data() {
    return {
      loanTypes: loanTypes,
      dealAnalysisSectionTypes: dealAnalysisSectionTypes
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
    formatMoney: formatMoney,
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
