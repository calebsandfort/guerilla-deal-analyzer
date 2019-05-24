<template>
  <v-container fluid class="pa-0 pb-3">
    <v-layout column v-if="showProgess">
      <v-flex xs12>
        <v-layout align-center justify-center row fill-height>
          <div style="width: 740px;">
            <v-progress-linear :indeterminate="true"></v-progress-linear>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex xs12 class="text-xs-center">
        <v-btn color="info" @click="generatePdf">Download</v-btn>
      </v-flex>
    </v-layout>
    <v-layout column>
      <v-flex xs12>
        <v-layout align-center justify-center row fill-height>
          <div style="width: 740px;">
            <PropertyReport id="propertyReport"></PropertyReport>
            <RepairEstimateReport id="repairEstimateReport"></RepairEstimateReport>
            <DealAnalysisCostsReport id="dealAnalysisCostsReport"></DealAnalysisCostsReport>
            <DealSheetReport id="dealSheetReport"></DealSheetReport>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout column>
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
      showProgess: false
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
      dealAnalysis: state => state.dealWizard.dealAnalysis
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
      /** WITH CSS */
      var propertyCanvasElement = document.createElement("canvas");
      var propertyReport = window.$("#propertyReport").get(0);

      await new Promise(function(resolve, reject) {
        html2canvas(propertyReport, { canvas: propertyCanvasElement }).then(function(canvas) {
          const img = canvas.toDataURL("image/png");
          doc.addImage(img, "JPEG", 7, 7);
          resolve();
        });
      });

      doc.addPage();

      var repairEstimateCanvasElement = document.createElement("canvas");
      var repairEstimateReport = window.$("#repairEstimateReport").get(0);

      await new Promise(function(resolve, reject) {
        html2canvas(repairEstimateReport, { canvas: repairEstimateCanvasElement }).then(function(canvas) {
          const img = canvas.toDataURL("image/png");
          doc.addImage(img, "JPEG", 7, 7);
          resolve();
        });
      });

      doc.addPage();

      var dealAnalysisCostsCanvasElement = document.createElement("canvas");
      var dealAnalysisCostsReport = window.$("#dealAnalysisCostsReport").get(0);

      await new Promise(function(resolve, reject) {
        html2canvas(dealAnalysisCostsReport, { canvas: dealAnalysisCostsCanvasElement }).then(function(canvas) {
          const img = canvas.toDataURL("image/png");
          doc.addImage(img, "JPEG", 7, 7);
          resolve();
        });
      });

      doc.addPage();

      var dealSheetCanvasElement = document.createElement("canvas");
      var dealSheetReport = window.$("#dealSheetReport").get(0);

      await new Promise(function(resolve, reject) {
        html2canvas(dealSheetReport, { canvas: dealSheetCanvasElement }).then(function(canvas) {
          const img = canvas.toDataURL("image/png");
          doc.addImage(img, "JPEG", 7, 7);
          resolve();
        });
      });

      this.showProgess = false;

      doc.save(`${this.property.streetAddress} - Deal Package`);
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
