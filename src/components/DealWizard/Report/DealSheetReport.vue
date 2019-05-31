<template>
  <v-container fluid grid-list-lg class="pa-0 pb-3">
    <ReportHeader header="Deal Sheet"></ReportHeader>
    <v-layout row>
      <v-flex xs12>
        <v-data-table
          :headers="dealTermsHeaders"
          :pagination.sync="pagination"
          :hide-actions="true"
          :disable-initial-sort="true"
          :items="dealTerms"
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
              <td class="font-weight-bold">
                {{ props.item.title1 }}
              </td>
              <td class="text-xs-right">
                {{ props.item.field1 }}
              </td>
              <td class="text-xs-right font-weight-bold">
                {{ props.item.title2 }}
              </td>
              <td class="text-xs-center">
                {{ props.item.field2 }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <VariableDealTable :variable-index="-1" :items="variableDeals.comboLineItems"></VariableDealTable>
    <!--    <VariableDealTable :variable-index="1" :items="variableDeals.rehabLineItems"></VariableDealTable>-->
    <!--    <VariableDealTable :variable-index="2" :items="variableDeals.roiLineItems"></VariableDealTable>-->
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import ReportHeader from "./ReportHeader";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
import * as loanTypes from "../../../backend/enums/loanTypes";
import VariableDealTable from "./VariableDealTable";

export default {
  name: "DealSheetReport",
  components: {
    ReportHeader,
    VariableDealTable
  },
  props: {},
  data() {
    return {
      dealTermsHeaders: [
        {
          text: "Terms",
          align: "left",
          sortable: false
        },
        { text: "", align: "center" },
        { text: "", align: "center" },
        { text: "", align: "center" }
      ],
      pagination: {
        rowsPerPage: -1
      }
    };
  },
  computed: {
    ...mapState({
      dealAnalysis: state => state.dealWizard.dealAnalysis,
      dealAnalysisSections: state => state.dealWizard.dealAnalysisSections,
      variableDeals: state => state.dealWizard.variableDeals
    }),
    dealTerms: function() {
      return [
        {
          key: 1,
          title1: "ARV",
          field1: formatMoney(this.dealAnalysis.DF_ARV, { precisions: 0 }),
          title2: "Loan Type",
          field2: loanTypes.getDisplayForValue(this.dealAnalysis.FC_LoanType)
        },
        {
          key: 2,
          title1: "Repair Estimate",
          field1: formatMoney(this.dealAnalysis.DF_RepairCosts, { precisions: 0 }),
          title2: "Hold Time",
          field2: this.dealAnalysis.DF_HoldTime
        },
        {
          key: 3,
          title1: "Purchase",
          field1: formatMoney(this.dealAnalysis.DF_PurchasePrice, { precisions: 0 }),
          title2: "ROI",
          field2: `${formatNumber(this.dealAnalysis.SNAP_ROI * 100, { precision: 2 })}%`
        },
        {
          key: 4,
          title1: "Total Cost",
          field1: formatMoney(this.dealAnalysis.SNAP_TotalCost, { precisions: 0 }),
          title2: "Profit",
          field2: formatMoney(this.dealAnalysis.SNAP_Profit, { precisions: 0 })
        }
      ];
    }
    // example: function() {return {}}
  },
  watch: {
    // comps: function () {}
  },
  methods: {
    formatMoney,
    formatNumber
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
