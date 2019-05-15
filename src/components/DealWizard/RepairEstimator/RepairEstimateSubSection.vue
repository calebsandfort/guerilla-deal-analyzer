<template>
  <v-container fluid grid-list-xs class="pa-0">
    <v-layout row>
      <v-flex xs12 class="pt-0">
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          :hide-actions="true"
          :disable-initial-sort="true"
          :items="lineItems"
          item-key="key"
          class="condensed-table"
        >
          <template v-slot:items="props">
            <tr
              :key="props.item.key"
              :class="[!props.item.selected ? 'grey--text' : '']"
            >
              <td class="text-xs-left" style="width: 10px;">
                <v-layout row>
                  <v-flex align-self-center>
                    <v-checkbox
                      :value="props.item.selected"
                      primary
                      hide-details
                      class="mr-0"
                      v-on:change="
                        updateRepairEstimateLineItem({
                          key: props.item.key,
                          field: 'selected',
                          val: $event
                        })
                      "
                    ></v-checkbox>
                  </v-flex>
                </v-layout>
              </td>
              <td>
                {{ props.item.name }}
              </td>
              <td class="text-xs-right">
                <VuetifyNumeric
                  :field="`${props.item.key}:quantity`"
                  css-class="hide-text-field-details small-text-field"
                  :precision="2"
                  :readonly="!props.item.selected"
                  :value="props.item.quantity"
                  v-on:input="fieldChangedNumber"
                >
                </VuetifyNumeric>
              </td>
              <td class="text-xs-right">
                {{ unitTypes.getDisplayForValue(props.item.unit) }}
              </td>
              <td class="text-xs-right">
                <VuetifyNumeric
                  :field="`${props.item.key}:unitCost`"
                  css-class="hide-text-field-details small-text-field"
                  :precision="2"
                  :readonly="!props.item.selected"
                  :value="props.item.unitCost"
                  v-on:input="fieldChangedNumber"
                >
                </VuetifyNumeric>
              </td>
              <td class="text-xs-right">
                {{ formatMoney(props.item.totalCost, { precision: 2 }) }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapMutations } from "vuex";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
import * as unitTypes from "../../../backend/enums/unitTypes";
import VuetifyNumeric from "../../Shared/VuetifyNumeric";

export default {
  name: "RepairEstimateSubSection",
  components: {
    VuetifyNumeric
  },
  props: {
    lineItems: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      unitTypes,
      headers: [
        { text: "", value: "selected", sortable: false },
        {
          text: "Repair Type",
          align: "left",
          sortable: false,
          value: "name"
        },
        {
          text: "# Units",
          align: "left",
          sortable: false,
          value: "quantity"
        },
        {
          text: "Unit",
          align: "left",
          sortable: false,
          value: "unit"
        },
        {
          text: "Unit Cost",
          align: "left",
          sortable: false,
          value: "unitCost"
        },
        {
          text: "Repair Cost",
          align: "left",
          sortable: false,
          value: "totalCost"
        }
      ],
      pagination: {
        rowsPerPage: -1
      }
    };
  },
  methods: {
    ...mapMutations({
      updateRepairEstimateLineItem: "dealWizard/updateRepairEstimateLineItem"
    }),
    formatMoney: formatMoney,
    formatNumber: formatNumber,

    fieldChangedNumber: _.debounce(function(args) {
      const split = args.field.split(":");

      this.updateRepairEstimateLineItem({
        key: split[0],
        field: split[1],
        val: args.value
      });
    }, 500)
  }
};
</script>

<style scoped></style>
