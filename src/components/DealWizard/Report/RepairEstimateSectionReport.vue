<template>
  <div>
    <v-layout row>
      <v-flex xs12 class="pt-0">
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          :hide-actions="true"
          :disable-initial-sort="true"
          :items="lineItems"
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
                {{ props.item.name }}
              </td>
              <td class="text-xs-right">
                {{ formatNumber(props.item.quantity, { precision: 2 }) }}
              </td>
              <td class="text-xs-right">
                {{ unitTypes.getDisplayForValue(props.item.unit) }}
              </td>
              <td class="text-xs-right">
                {{ formatMoney(props.item.unitCost, { precision: 2 }) }}
              </td>
              <td class="text-xs-right">
                {{ formatMoney(props.item.totalCost, { precision: 2 }) }}
              </td>
            </tr>
          </template>
          <template v-slot:footer>
            <td :colspan="headers.length" class="text-xs-right">
              <strong>{{ formatMoney(repairEstimateSection.totalCost, { precision: 2 }) }}</strong>
            </td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import * as repairEstimateSectionTypes from "../../../backend/enums/repairEstimateSectionTypes";
import * as unitTypes from "../../../backend/enums/unitTypes";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";

export default {
  name: "RepairEstimateSectionReport",
  components: {},
  props: {
    sectionType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      repairEstimateSectionTypes,
      unitTypes,
      headers: [
        {
          text: repairEstimateSectionTypes.getDisplayForValue(this.sectionType),
          align: "left",
          sortable: false,
          value: "name"
        },
        {
          text: "# Units",
          align: "right",
          sortable: false,
          value: "quantity"
        },
        {
          text: "Unit",
          align: "right",
          sortable: false,
          value: "unit"
        },
        {
          text: "Unit Cost",
          align: "right",
          sortable: false,
          value: "unitCost"
        },
        {
          text: "Repair Cost",
          align: "right",
          sortable: false,
          value: "totalCost"
        }
      ],
      pagination: {
        rowsPerPage: -1
      }
    };
  },
  computed: {
    ...mapState({
      repairEstimate: state => state.dealWizard.repairEstimate
    }),
    repairEstimateSection: function() {
      const that = this;
      const x = _.find(that.repairEstimate.sections, function(x) {
        return x.sectionType == that.sectionType;
      });

      return x;
    },
    lineItems: function() {
      const that = this;
      let list = [];

      const repairEstimateSection = _.find(that.repairEstimate.sections, function(x) {
        return x.sectionType == that.sectionType;
      });

      if (repairEstimateSection.selected) {
        const subSections = _.filter(repairEstimateSection.subSections, function(x) {
          return x.selected;
        });

        for (let i = 0; i < subSections.length; i++) {
          const subSection = subSections[i];
          list = _.concat(
            list,
            _.filter(subSection.lineItems, function(x) {
              return x.selected;
            })
          );
        }
      }

      return list;
    }
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
