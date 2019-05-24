<template>
  <v-container fluid grid-list-lg class="pa-0">
    <ReportHeader header="Deal Sheet"></ReportHeader>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import ReportHeader from "./ReportHeader";

export default {
  name: "DealSheetReport",
  components: {
    ReportHeader
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
