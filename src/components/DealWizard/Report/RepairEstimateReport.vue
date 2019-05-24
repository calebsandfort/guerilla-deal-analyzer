<template>
  <v-container fluid grid-list-lg class="pa-0 pb-3">
    <ReportHeader header="Rehab Estimate"></ReportHeader>
    <template v-for="repairEstimateSection in selectedSections">
      <div :key="`div_${repairEstimateSection.sectionType}`" class="pt-3">
        <RepairEstimateSectionReport :key="repairEstimateSection.sectionType" :section-type="repairEstimateSection.sectionType"></RepairEstimateSectionReport>
      </div>
    </template>
    <v-layout row>
      <v-flex xs12 class="pt-0">
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          :hide-actions="true"
          :disable-initial-sort="true"
          :items="selectedSections"
          item-key="key"
          class="super-condensed-table elevation-1"
        >
          <template slot="headers" slot-scope="props">
            <tr class="blue">
              <th
                v-for="(header, index) in props.headers"
                :key="`header_${index}`"
                :class="['white--text', `text-xs-${header.align}`, index == 0 ? 'title' : '']"
              >
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr :key="props.item.key">
              <td>
                {{ repairEstimateSectionTypes.getDisplayForValue(props.item.sectionType) }}
              </td>
              <td class="text-xs-right">
                {{ formatMoney(props.item.totalCost, { precision: 2 }) }}
              </td>
            </tr>
          </template>
          <template v-slot:footer>
            <td :colspan="headers.length" class="text-xs-right">
              <strong>{{ formatMoney(totalCost, { precision: 2 }) }}</strong>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import ReportHeader from "./ReportHeader";
import RepairEstimateSectionReport from "./RepairEstimateSectionReport";
import formatMoney from "accounting-js/lib/formatMoney";
import colors from "vuetify/es5/util/colors";
import * as repairEstimateSectionTypes from "../../../backend/enums/repairEstimateSectionTypes";

export default {
  name: "RepairEstimateReport",
  components: {
    ReportHeader,
    RepairEstimateSectionReport
  },
  props: {},
  data() {
    return {
      repairEstimateSectionTypes,
      headers: [
        {
          text: "Totals",
          align: "left",
          sortable: false,
          value: "name"
        },
        {
          text: "Cost",
          align: "right",
          sortable: false,
          value: "quantity"
        }
      ],
      pagination: {
        rowsPerPage: -1
      }
    };
  },
  computed: {
    ...mapState({
      repairEstimate: state => state.dealWizard.repairEstimate,
      totalCost: state => state.dealWizard.repairEstimate.totalCost
    }),
    selectedSections: function() {
      return _.filter(this.repairEstimate.sections, function(x) {
        return x.selected;
      });
    }
  },
  watch: {
    // comps: function () {}
  },
  methods: {
    formatMoney
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
