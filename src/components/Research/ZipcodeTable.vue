<template>
  <v-container fluid grid-list-lg>
    <v-layout row>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          disable-initial-sort
          mustSort
          :hide-actions="true"
          :items="filteredZipcodes"
          item-key="zipcode"
          class="super-condensed-table elevation-1"
        >
          <template slot="headers" slot-scope="props">
            <tr class="blue">
              <th
                v-for="(header, index) in props.headers"
                :key="`header_${index}`"
                :class="[
                  'column sortable',
                  'white--text',
                  `text-xs-${header.align}`,
                  header.descending ? 'desc' : 'asc',
                  indexHeaderInStack(header) >= 0 ? 'active' : ''
                ]"
                @click="changeSort(header)"
              >
                <template>
                  {{ indexHeaderInStack(header) >= 0 ? indexHeaderInStack(header) + 1 : "" }}
                  <v-icon small class="white--text">arrow_upward</v-icon>

                  {{ header.text }}
                </template>
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr :key="props.item.zipcode" :class="[getColorScaleColorString(props.item.marketTemperature), 'lighten-2', 'grey--text', 'text--darken-4']">
              <td>{{ props.item.zipcode }}</td>
              <td class="text-xs-right">{{ props.item.marketTemperature }}</td>
              <td class="text-xs-right">{{ tempLabel(props.item.marketTemperature) }}</td>
              <td class="text-xs-right">
                {{ formatMoney(props.item.medianHomeValue, { precision: 0 }) }}
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
import { mapState, mapMutations, mapActions } from "vuex";
import formatMoney from "accounting-js/lib/formatMoney";
import ColorHelper from "../../utilities/ColorHelper";

export default {
  name: "ZipcodeTable",
  components: {},
  props: {},
  data() {
    return {
      headers: [
        {
          text: "Zipcode",
          align: "left",
          value: "zipcode"
        },
        { text: "Market Temp", value: "marketTemperature", align: "right" },
        { text: "Market Type", value: "marketTemperature", align: "right" },
        { text: "Median Home Value", value: "medianHomeValue", align: "right" }
      ],
      sortStack: [{ text: "Market Temp", value: "marketTemperature", descending: true }],
      // sortStack: [{ text: "Status", value: "status", descending: false }],
      pagination: {
        // sortBy: "keywords_count",
        // descending: true,
        rowsPerPage: -1
      }
    };
  },
  computed: {
    ...mapState({
      zipcodes: state => state.research.zipcodes,
      research: state => state.research
    }),
    filteredZipcodes: function() {
      const that = this;

      let filteredList = _.map(this.zipcodes, function(zc) {
        return Object.assign({}, zc);
      });

      let resultRows = [...filteredList];
      let stack = this.sortStack;
      resultRows.sort(function(a, b) {
        for (let i in stack) {
          let key = stack[i].value;
          let desc = stack[i].descending;
          if (a[key] > b[key]) return desc ? -1 : 1;
          else if (a[key] < b[key]) return desc ? 1 : -1;
          else continue;
        }
        return 0;
      });

      return resultRows;
    }
    // example: function() {return {}}
  },
  watch: {
    // comps: function () {}
  },
  methods: {
    tempLabel: function(i) {
      return i <= 30 ? "Buyers" : i >= 80 ? "Sellers" : "Neutral";
    },
    getColorScaleColorString(val) {
      return ColorHelper.getColorScaleColorString(val);
    },
    formatMoney,
    nextSort() {
      let index = this.headers.findIndex(h => h.value === this.pagination.sortBy);
      index = (index + 1) % this.headers.length;
      index = index === 0 ? index + 1 : index;
      this.pagination.sortBy = this.headers[index].value;
    },
    changeSort(header) {
      let indexH = this.indexHeaderInStack(header);
      if (indexH < 0) {
        this.$set(header, "descending", false);
        this.sortStack.push(header);
      } else {
        if (!header.descending) this.$set(header, "descending", true);
        else this.sortStack.splice(indexH, 1);
      }
    },
    indexHeaderInStack(header) {
      return this.sortStack.findIndex(h => header.value === h.value);
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
