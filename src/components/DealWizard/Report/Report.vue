<template>
  <v-container fluid class="pa-0 pb-3">
    <v-layout column v-show="showProgess || crunchingVariableDeals">
      <v-flex xs12>
        <v-layout align-center justify-center row fill-height>
          <div style="width: 740px;">
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout column v-show="!crunchingVariableDeals">
      <v-flex xs12 class="text-xs-center">
        <v-btn color="info" @click="generatePdf">Download</v-btn>
      </v-flex>
    </v-layout>
    <v-layout column v-show="!crunchingVariableDeals">
      <v-flex xs12>
        <v-layout align-center justify-center row fill-height>
          <div style="width: 740px;">
            <v-layout row>
              <v-flex shrink pa-1 pr-3 align-self-center class="subheading font-weight-medium blue-grey--text text--darken-2">
                Include
              </v-flex>
              <v-flex shrink pa-1 pr-3 align-self-center>
                <v-checkbox v-model="includePropertyReport" label="Comp Package"></v-checkbox>
              </v-flex>
              <v-flex shrink pa-1 pr-3 align-self-center v-show="!repairEstimate.quick">
                <v-checkbox v-model="includeRepairEstimateReport" label="Repair Estimate"></v-checkbox>
              </v-flex>
              <v-flex shrink pa-1 pr-3 align-self-center>
                <v-checkbox v-model="includeDealSheetReport" label="Deal Sheet"></v-checkbox>
              </v-flex>
              <v-flex shrink pa-1 pr-3 align-self-center>
                <v-checkbox v-model="includeDealAnalysisCostsReport" label="Deal Analysis - Costs"></v-checkbox>
              </v-flex>
            </v-layout>

            <PropertyReport id="propertyReport" v-show="includePropertyReport"></PropertyReport>
            <RepairEstimateReport id="repairEstimateReport" v-show="!repairEstimate.quick && includeRepairEstimateReport"></RepairEstimateReport>
            <DealSheetReport id="dealSheetReport" v-show="includeDealSheetReport"></DealSheetReport>
            <DealAnalysisCostsReport id="dealAnalysisCostsReport" v-show="includeDealAnalysisCostsReport"></DealAnalysisCostsReport>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout column v-show="!crunchingVariableDeals">
      <v-flex xs12 class="text-xs-center">
        <v-btn color="info" @click="generatePdf">Download</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import PropertyReport from "./PropertyReport";
import RepairEstimateReport from "./RepairEstimateReport";
import DealAnalysisCostsReport from "./DealAnalysisCostsReport";
import DealSheetReport from "./DealSheetReport";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  name: "Report",
  components: {
    PropertyReport,
    RepairEstimateReport,
    DealAnalysisCostsReport,
    DealSheetReport
  },
  props: {},
  data() {
    return {
      showProgess: false,
      includePropertyReport: true,
      includeRepairEstimateReport: true,
      includeDealSheetReport: true,
      includeDealAnalysisCostsReport: true
    };
  },
  computed: {
    ...mapState({
      property: state => state.dealWizard.item,
      comps: state => state.dealWizard.comps,
      dealComps: state => state.dealWizard.dealComps,
      compFilter: state => state.dealWizard.compFilter,
      arv: state => state.dealWizard.arv,
      repairEstimate: state => state.dealWizard.repairEstimate,
      dealAnalysis: state => state.dealWizard.dealAnalysis,
      crunchingVariableDeals: state => state.dealWizard.crunchingVariableDeals
    })
    // example: function() {return {}}
  },
  watch: {
    // comps: function () {}
  },
  methods: {
    async generatePdf() {
      this.showProgess = true;

      const doc = new jsPDF();
      let docStarted = false;

      if (this.includePropertyReport) {
        var propertyCanvasElement = document.createElement("canvas");
        var propertyReport = window.$("#propertyReport").get(0);

        await new Promise(function(resolve, reject) {
          html2canvas(propertyReport, { canvas: propertyCanvasElement }).then(function(canvas) {
            const img = canvas.toDataURL("image/png");
            doc.addImage(img, "JPEG", 7, 7);
            resolve();
          });
        });

        docStarted = true;
      }

      if (!this.repairEstimate.quick && this.includeRepairEstimateReport) {
        if (docStarted) doc.addPage();

        var repairEstimateCanvasElement = document.createElement("canvas");
        var repairEstimateReport = window.$("#repairEstimateReport").get(0);

        await new Promise(function(resolve, reject) {
          html2canvas(repairEstimateReport, { canvas: repairEstimateCanvasElement }).then(function(canvas) {
            const img = canvas.toDataURL("image/png");
            doc.addImage(img, "JPEG", 7, 7);
            resolve();
          });
        });

        docStarted = true;
      }

      if (this.includeDealSheetReport) {
        if (docStarted) doc.addPage();

        var dealSheetCanvasElement = document.createElement("canvas");
        var dealSheetReport = window.$("#dealSheetReport").get(0);

        await new Promise(function(resolve, reject) {
          html2canvas(dealSheetReport, { canvas: dealSheetCanvasElement }).then(function(canvas) {
            const img = canvas.toDataURL("image/png");
            doc.addImage(img, "JPEG", 7, 7);
            resolve();
          });
        });

        docStarted = true;
      }

      if (this.includeDealAnalysisCostsReport) {
        if (docStarted) doc.addPage();

        var dealAnalysisCostsCanvasElement = document.createElement("canvas");
        var dealAnalysisCostsReport = window.$("#dealAnalysisCostsReport").get(0);

        await new Promise(function(resolve, reject) {
          html2canvas(dealAnalysisCostsReport, { canvas: dealAnalysisCostsCanvasElement }).then(function(canvas) {
            const img = canvas.toDataURL("image/png");
            doc.addImage(img, "JPEG", 7, 7);
            resolve();
          });
        });
        docStarted = true;
      }

      this.showProgess = false;

      if (docStarted) doc.save(`${this.property.streetAddress} - Deal Package`);
      else {
        alert("At least one selection must be selected to download.");
      }
    }
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
