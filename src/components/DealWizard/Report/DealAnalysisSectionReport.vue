<template>
  <v-data-table
    :headers="dealAnalysisSection.headers"
    :pagination.sync="pagination"
    :hide-actions="true"
    :disable-initial-sort="true"
    :items="dealAnalysisSection.items"
    item-key="key"
    class="super-condensed-table elevation-1"
  >
    <template slot="headers" slot-scope="props">
      <tr class="blue">
        <th
          v-for="(header, index) in props.headers"
          :key="`header_${index}`"
          :class="['white--text', index != 0 ? `text-xs-right` : 'text-xs-left', index == 0 ? 'title' : '']"
        >
          <div v-if="index != 0">{{ header.text }}</div>
          <div v-else>
            {{ dealAnalysisSectionTypes.getDisplayForValue(dealAnalysisSection.sectionType.value).split(" ")[0] }}
          </div>
        </th>
      </tr>
    </template>
    <template v-slot:items="props">
      <tr :key="props.item.key">
        <td>
          {{ props.item.title }}
        </td>
        <td class="text-xs-right">
          <div v-if="props.item.field1 != ''">{{ formatField(props.item.currency1, dealAnalysis[props.item.field1]) }}</div>
        </td>
        <td class="text-xs-right">
          <div v-if="props.item.field2 != ''">{{ formatField(props.item.currency2, dealAnalysis[props.item.field2]) }}</div>
        </td>
      </tr>
    </template>
    <template v-slot:footer>
      <td :colspan="dealAnalysisSection.headers.length" class="text-xs-right">
        <strong>{{
          formatMoney(dealAnalysisSectionTypes.getTotalCost(dealAnalysisSection.sectionType, dealAnalysis), {
            precision: 2
          })
        }}</strong>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
import * as dealAnalysisSectionTypes from "../../../backend/enums/dealAnalysisSectionTypes";

export default {
  name: "DealAnalysisSectionReport",
  components: {},
  props: {
    dealAnalysisSection: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dealAnalysisSectionTypes,
      pagination: {
        rowsPerPage: -1
      }
    };
  },
  computed: {
    ...mapState({
      dealAnalysis: state => state.dealWizard.dealAnalysis
    })
    // example: function() {return {}}
  },
  watch: {
    // comps: function () {}
  },
  methods: {
    formatMoney,
    formatNumber,
    formatField(currency, val) {
      //"%v %s" : "%s %v"

      switch (currency) {
        case "$":
          return formatMoney(val, {
            symbol: "$",
            format: "%s %v",
            precision: 2
          });
        case "%":
          return formatMoney(val * 100, {
            symbol: "%",
            format: "%v %s",
            precision: 2
          });
        default:
          return formatNumber(val, { precision: 2 });
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
