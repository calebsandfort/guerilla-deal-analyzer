<template>
  <v-expansion-panel-content :key="`dealAnalysisSection_${dealAnalysisSection.sectionType.value}`">
    <template v-slot:header>
      <v-container fluid grid-list-xs class="pa-0">
        <v-layout row class="font-weight-bold">
          <v-flex grow pa-1 align-self-center>
            {{ dealAnalysisSection.sectionType.display }}
          </v-flex>
          <v-flex shrink pa-1 pr-3 align-self-center>
            {{
              formatMoney(dealAnalysisSectionTypes.getTotalCost(dealAnalysisSection.sectionType, dealAnalysis), {
                precision: 2
              })
            }}
          </v-flex>
        </v-layout>
      </v-container>
    </template>
    <v-card>
      <v-card-text class="pt-0">
        <v-container fluid grid-list-xs class="pa-0">
          <v-layout row>
            <v-flex xs12 class="pt-0">
              <v-data-table
                :headers="dealAnalysisSection.headers"
                :pagination.sync="pagination"
                :hide-actions="true"
                :disable-initial-sort="true"
                :items="dealAnalysisSection.items"
                item-key="key"
                class="condensed-table"
              >
                <template v-slot:items="props">
                  <tr :key="props.item.key">
                    <td>
                      {{ props.item.title }}
                    </td>
                    <td class="text-xs-right">
                      <div v-if="props.item.readonly1">
                        {{ formatField(props.item.currency1, dealAnalysis[props.item.field1]) }}
                      </div>
                      <VuetifyNumeric
                        v-else-if="props.item.field1 != ''"
                        :field="`dealAnalysis.${props.item.field1}`"
                        css-class="hide-text-field-details small-text-field"
                        :precision="2"
                        :currency="props.item.currency1"
                        :currency-symbol-position="props.item.currency1 == '%' ? 'suffix' : 'prefix'"
                        :value="dealAnalysis[props.item.field1] * (props.item.currency1 == '%' ? 100 : 1)"
                        v-on:input="fieldChangedNumber"
                      >
                      </VuetifyNumeric>
                    </td>
                    <td class="text-xs-right">
                      <div v-if="props.item.readonly2">
                        {{ formatField(props.item.currency2, dealAnalysis[props.item.field2]) }}
                      </div>
                      <VuetifyNumeric
                        v-else-if="props.item.field2 != ''"
                        :field="`dealAnalysis.${props.item.field2}`"
                        css-class="hide-text-field-details small-text-field"
                        :precision="2"
                        :currency="props.item.currency2"
                        :currency-symbol-position="props.item.currency2 == '%' ? 'suffix' : 'prefix'"
                        :value="dealAnalysis[props.item.field2] * (props.item.currency2 == '%' ? 100 : 1)"
                        v-on:input="fieldChangedNumber"
                      >
                      </VuetifyNumeric>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-expansion-panel-content>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import * as dealAnalysisSectionTypes from "../../../backend/enums/dealAnalysisSectionTypes";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
import VuetifyNumeric from "../../Shared/VuetifyNumeric";

export default {
  name: "DealAnalysisSection",
  components: {
    VuetifyNumeric
  },
  props: {
    dealAnalysisSection: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dealAnalysisSectionTypes: dealAnalysisSectionTypes,
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
    formatMoney: formatMoney,
    formatNumber: formatNumber,
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
    },
    fieldChangedNumber: _.debounce(function(args) {
      this.setField({
        name: args.field,
        v: args.value
      });
    }, 500),
    // ...mapMutations({
    //   example: "example/example",
    // }),
    ...mapActions({
      setField: "dealWizard/setField"
    })
    // example() {}
  }
};
</script>

<style scoped></style>
