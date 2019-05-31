<template>
  <v-layout row>
    <v-flex xs12>
      <v-data-table
        :headers="headers"
        :pagination.sync="pagination"
        :hide-actions="true"
        :disable-initial-sort="true"
        :items="items"
        item-key="key"
        class="super-condensed-table elevation-1"
      >
        <template slot="headers" slot-scope="props">
          <tr class="blue">
            <th
              v-for="(header, index) in props.headers"
              :key="`header_${index}`"
              :style="`${index == 0 ? 'padding-left: 12px;' : ''}`"
              :class="['white--text', `text-xs-${header.align}`]"
            >
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template v-slot:items="props">
          <tr
            :key="props.item.key"
            :class="{
              'lighten-4': true,
              'light-blue': props.item.actual,
              red: !props.item.actual && props.item.askDiff < -discountThreshold,
              green: !props.item.actual && props.item.askDiff > discountThreshold
            }"
          >
            <td
              :class="{
                'font-weight-bold': variableIndex == 0
              }"
            >
              {{ formatMoney(props.item.purchase, { precision: 2 }) }}
            </td>
            <td
              :class="{
                'text-xs-right': true
              }"
            >
              {{
                formatMoney(props.item.askDiff * 100, {
                  symbol: "%",
                  precision: 0,
                  format: {
                    zero: "%v%s",
                    pos: "%v%s",
                    neg: "(%v%s)"
                  }
                })
              }}
            </td>
            <td
              :class="{
                'font-weight-bold': variableIndex == 1,
                'text-xs-right': true
              }"
            >
              {{ formatMoney(props.item.repairCost, { precision: 2 }) }}
            </td>
            <td
              :class="{
                'font-weight-bold': variableIndex == 2,
                'text-xs-right': true
              }"
            >
              {{ formatNumber(props.item.roi * 100, { precision: 2 }) }}%
            </td>
            <td
              :class="{
                'font-weight-bold': variableIndex == 3,
                'text-xs-right': true
              }"
            >
              {{ formatMoney(props.item.profit, { precision: 2 }) }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";

export default {
  name: "VariableDealTable",
  components: {},
  props: {
    variableIndex: {
      type: Number
    },
    items: {
      type: Array
    }
  },
  data() {
    return {
      headers: [
        {
          text: "Purchase",
          align: "left",
          sortable: false
        },
        { text: "Ask Diff", align: "right" },
        { text: "Repair Cost", align: "right" },
        { text: "ROI", align: "right" },
        { text: "Profit", align: "right" }
      ],
      pagination: {
        rowsPerPage: -1
      }
    };
  },
  computed: {
    ...mapState({
      discountThreshold: state => state.dealWizard.discountThreshold
    })
    // ...mapState({
    //   example: state => state.example,
    // }),
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
