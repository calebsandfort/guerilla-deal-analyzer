<template>
  <v-container fluid grid-list-lg class="pa-0">
    <ReportHeader header="Deal Analysis - Costs"></ReportHeader>
    <v-layout row>
      <v-flex xs6>
        <DealAnalysisSectionReport :deal-analysis-section="dealAnalysisSections[0]"></DealAnalysisSectionReport>
      </v-flex>
      <v-flex xs6>
        <DealAnalysisSectionReport :deal-analysis-section="dealAnalysisSections[2]"></DealAnalysisSectionReport>
      </v-flex>
    </v-layout>
    <v-layout row class="pb-3">
      <v-flex xs6>
        <DealAnalysisSectionReport :deal-analysis-section="dealAnalysisSections[1]"></DealAnalysisSectionReport>
      </v-flex>
      <v-flex xs6>
        <DealAnalysisSectionReport :deal-analysis-section="dealAnalysisSections[3]"></DealAnalysisSectionReport>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import ReportHeader from "./ReportHeader";
import DealAnalysisSectionReport from "./DealAnalysisSectionReport";

export default {
  name: "DealAnalysisReport",
  components: {
    ReportHeader,
    DealAnalysisSectionReport
  },
  props: {},
  data() {
    return {};
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
    // ...mapActions({
    //   setField: "example/example",
    // }),
    // example() {}
  }
};
</script>

<style scoped></style>
