<template>
  <v-container fluid class="px-0 pt-0">
    <Toolbar back-path="/"></Toolbar>
    <v-content>
      <v-container fluid v-if="leadFinderStore.finding">
        <v-layout text-xs-center wrap>
          <v-flex xs12>
            <v-progress-circular
              :width="7"
              :size="70"
              color="green"
              indeterminate
            ></v-progress-circular>
          </v-flex>
        </v-layout>
      </v-container>
      <v-alert v-model="denied" dismissible type="error">
        Denied by Zillow:(
      </v-alert>
      <v-container fluid class="pb-0">
        <v-expansion-panel expand v-model="panelsExpanded">
          <v-expansion-panel-content>
            <template v-slot:header
              ><h3>Load Properties</h3>
            </template>
            <v-card>
              <v-card-text>
                <v-container fluid grid-list-lg class="pa-0">
                  <v-layout row>
                    <v-flex xs10>
                      <v-textarea
                        outline
                        name="urls"
                        label="URLs"
                        v-model="urls"
                        rows="2"
                      ></v-textarea>
                    </v-flex>
                    <v-flex xs2>
                      <v-btn
                        block
                        small
                        color="success"
                        v-on:click="findClick"
                        :disabled="urls.length == 0"
                        >Find
                      </v-btn>
                      <v-btn
                        block
                        small
                        color="info"
                        v-on:click="loadExistingClick"
                        >Load Existing
                      </v-btn>
                      <v-btn
                        block
                        small
                        color="error"
                        v-on:click="clearClick"
                        :disabled="urls.length > 0"
                        >Clear
                      </v-btn>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs10 class="pt-0">
                      <v-text-field
                        label="Tag"
                        v-model="tag"
                        class="pt-0"
                      ></v-text-field>
                      <v-select
                        v-model="status"
                        :items="statusItems"
                        item-text="display"
                        item-value="value"
                        label="Status"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header
              ><h3>Filters</h3>
            </template>
            <v-card>
              <v-card-text>
                <v-container fluid grid-list-lg class="py-0">
                  <v-layout row>
                    <v-flex xs2 align-self-center>
                      <h4 class="text-xs-right pr-2">
                        Beds
                      </h4>
                    </v-flex>
                    <v-flex xs2>
                      <v-select
                        :items="filterData.listItems.amenityCount"
                        v-model="filterData.values.beds.min"
                        label="Min"
                      ></v-select>
                    </v-flex>
                    <v-flex xs2>
                      <v-select
                        :items="filterData.listItems.amenityCount"
                        v-model="filterData.values.beds.max"
                        label="Max"
                      ></v-select>
                    </v-flex>
                    <v-flex xs2 align-self-center>
                      <h4 class="text-xs-right pr-2">
                        Baths
                      </h4>
                    </v-flex>
                    <v-flex xs2>
                      <v-select
                        :items="filterData.listItems.amenityCount"
                        v-model="filterData.values.baths.min"
                        label="Min"
                      ></v-select>
                    </v-flex>
                    <v-flex xs2>
                      <v-select
                        :items="filterData.listItems.amenityCount"
                        v-model="filterData.values.baths.max"
                        label="Max"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs2 align-self-center>
                      <h4 class="text-xs-right pr-2">
                        SqFt
                      </h4>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field
                        label="Min"
                        v-model.number="filterData.values.sqft.min"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field
                        label="Max"
                        v-model.number="filterData.values.sqft.max"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2 align-self-center>
                      <h4 class="text-xs-right pr-2">
                        Built
                      </h4>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field
                        label="Min"
                        v-model.number="filterData.values.year_built.min"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field
                        label="Max"
                        v-model.number="filterData.values.year_built.max"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs2 align-self-center>
                      <h4 class="text-xs-right pr-2">
                        Days Listed
                      </h4>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field
                        label="Min"
                        v-model.number="filterData.values.days_listed.min"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field
                        label="Max"
                        v-model.number="filterData.values.days_listed.max"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2 align-self-center>
                      <h4 class="text-xs-right pr-2">
                        Statuses
                      </h4>
                    </v-flex>
                    <v-flex xs4>
                      <v-select
                        v-model="filterData.values.statuses"
                        :items="filterData.listItems.statuses"
                        item-text="display"
                        item-value="value"
                        label="Select"
                        return-object
                        single-line
                        attach
                        chips
                        multiple
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs2>
                      <h4 class="text-xs-right pr-2">
                        Ratio
                      </h4>
                    </v-flex>
                    <v-flex xs4>
                      <v-slider
                        v-model="filterData.values.price_to_zestimate.threshold"
                        :min="filterData.values.price_to_zestimate.min"
                        :max="filterData.values.price_to_zestimate.max"
                        :step="filterData.values.price_to_zestimate.step"
                        thumb-color="red"
                        thumb-label="always"
                        :thumb-size="24"
                      ></v-slider>
                    </v-flex>
                    <v-flex xs2>
                      <h4 class="text-xs-right pr-2">
                        Keywords
                      </h4>
                    </v-flex>
                    <v-flex xs4>
                      <v-slider
                        v-model="filterData.values.keywords_count.threshold"
                        :min="filterData.values.keywords_count.min"
                        :max="filterData.values.keywords_count.max"
                        thumb-color="red"
                        thumb-label="always"
                        :thumb-size="24"
                      ></v-slider>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-container>
      <v-container fluid>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          disable-initial-sort
          mustSort
          :expand="expand"
          :loading="loading"
          :items="filteredProperties"
          class="elevation-1"
          item-key="zillow_propertyId"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="[
                  'column sortable',
                  header.descending ? 'desc' : 'asc',
                  indexHeaderInStack(header) >= 0 ? 'active' : ''
                ]"
                @click="changeSort(header)"
              >
                {{
                  indexHeaderInStack(header) >= 0
                    ? indexHeaderInStack(header) + 1
                    : ""
                }}
                <v-icon small>arrow_upward</v-icon>

                {{ header.text }}
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr
              @click="props.expanded = !props.expanded"
              v-bind:class="{
                'yellow lighten-2': props.item.status == statuses.EXPLORE.value,
                'light-green lighten-2':
                  props.item.status == statuses.TARGET.value
              }"
            >
              <td>
                <a :href="props.item.zillow_url" target="_blank">{{
                  props.item.streetPlusZip
                }}</a>
              </td>
              <td class="text-xs-right">{{ props.item.beds }}</td>
              <td class="text-xs-right">{{ props.item.baths }}</td>
              <td class="text-xs-right">
                {{ formatNumber(props.item.sqft, { precision: 0 }) }}
              </td>
              <td class="text-xs-right">{{ props.item.year_built }}</td>
              <td class="text-xs-right">
                {{ formatMoney(props.item.price, { precision: 0 }) }}
              </td>
              <td class="text-xs-right">
                {{ formatMoney(props.item.zestimate, { precision: 0 }) }}
              </td>
              <td class="text-xs-right">
                {{
                  formatNumber(props.item.price_to_zestimate, { precision: 2 })
                }}
              </td>
              <td class="text-xs-right">
                {{ props.item.keywords.join(", ") }}
              </td>
              <td class="text-xs-right">{{ props.item.days_listed }}</td>
              <td class="text-xs-right">{{ props.item.status_display }}</td>
            </tr>
          </template>
          <template v-slot:expand="props">
            <ExpandoProperty
              :property="props.item"
              v-on:expando-update="expandoUpdateTriggered"
            ></ExpandoProperty>
          </template>
        </v-data-table>
      </v-container>
    </v-content>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapActions } from "vuex";
import Toolbar from "../Toolbar";
import ExpandoProperty from "../Property/ExpandoProperty";
import { getRequestVariables as propertyRequest } from "../../api/property";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
// import * as entityQuery from "../../backend/utilities/entityQuery";
import * as statuses from "../../common/enums/statuses";
import * as utilities from "../../backend/utilities/utilities";

export default {
  name: "LeadFinder",
  components: {
    Toolbar,
    ExpandoProperty
  },
  data() {
    return {
      urls: "",
      tag: "ZILLOW",
      status: statuses.statuses.NEW.value,
      loading: false,
      denied: false,
      expand: false,
      delay: 500,
      statuses: statuses.statuses,
      statusItems: statuses.array(),
      panelsExpanded: [true, false],
      search_keywords: [
        "invest",
        "sweat",
        "as is",
        "as-is",
        "distress",
        "reo",
        "tlc",
        "contractor",
        "gut",
        "work",
        "motivated",
        "quick close",
        "cash",
        "opportunity",
        "bones",
        "imagi",
        "potential"
      ],
      unwanted_keywords: [
        "manufactured home",
        "mobile home",
        "double wide",
        "remodeled",
        "new construction",
        "auction",
        "floating"
      ],
      headers: [
        {
          text: "Address",
          align: "left",
          sortable: false,
          value: "streetPlusZip"
        },
        { text: "Beds", value: "beds" },
        { text: "Baths", value: "baths" },
        { text: "SqFt", value: "sqft" },
        { text: "Built", value: "year_built" },
        { text: "Price", value: "price" },
        { text: "Zesitmate", value: "zestimate" },
        { text: "Ratio", value: "price_to_zestimate" },
        { text: "Keywords", value: "keywords_count" },
        { text: "Days Listed", value: "days_listed" },
        { text: "Status", value: "status" }
      ],
      sortStack: [
        { text: "Keywords", value: "keywords_count", descending: true },
        { text: "Days Listed", value: "days_listed", descending: true }
      ],
      // sortStack: [{ text: "Status", value: "status", descending: false }],
      pagination: {
        // sortBy: "keywords_count",
        // descending: true,
        rowsPerPage: 10
      },
      filterData: {
        listItems: {
          amenityCount: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          statuses: statuses.array()
        },
        values: {
          beds: {
            min: 0,
            max: 9
          },
          baths: {
            min: 0,
            max: 9
          },
          sqft: {
            min: 0,
            max: 5000
          },
          year_built: {
            min: 1850,
            max: 2030
          },
          price_to_zestimate: {
            threshold: 1.5,
            min: 0,
            max: 2,
            step: 0.05
          },
          statuses: [
            statuses.statuses.NEW,
            statuses.statuses.ACTIVE,
            statuses.statuses.EXPLORE,
            statuses.statuses.TARGET
          ],
          keywords_count: {
            threshold: 1,
            min: 0,
            max: 25
          },
          days_listed: {
            min: 0,
            max: 20000
          }
        }
      }
    };
  },
  watch: {
    "leadFinderStore.list": function() {
      this.loading = false;
    },
    "leadFinderStore.denied": function() {
      this.denied = this.leadFinderStore.denied;
    }
  },
  // created: function() {
  //   this.loadExistingClick();
  // },
  computed: {
    ...mapState({
      leadFinderStore: state => state.leadFinder
    }),
    url_array: function() {
      return _.filter(this.urls.split(", "), function(url) {
        return url !== "";
      });
    },
    filteredProperties: function() {
      let filteredList = _.map(this.leadFinderStore.list, function(property) {
        return Object.assign({}, property);
      });

      const that = this;
      const tempBathMin = this.filterData.values.beds.min;

      //remove unwanted
      filteredList = _.filter(filteredList, function(item) {
        return item.price > 0 && item.price_to_zestimate < 1000;
      });

      for (let i = 0; i < that.unwanted_keywords.length; i++) {
        filteredList = _.filter(filteredList, function(item) {
          return (
            item.description.toLowerCase().indexOf(that.unwanted_keywords[i]) ==
            -1
          );
        });
      }

      //beds
      filteredList = _.filter(filteredList, function(item) {
        return (
          item.beds >= that.filterData.values.beds.min &&
          item.beds <= that.filterData.values.beds.max
        );
      });

      //baths
      filteredList = _.filter(filteredList, function(item) {
        return (
          item.baths >= that.filterData.values.baths.min &&
          item.baths <= that.filterData.values.baths.max
        );
      });

      //sqft
      filteredList = _.filter(filteredList, function(item) {
        return (
          item.sqft >= that.filterData.values.sqft.min &&
          item.sqft <= that.filterData.values.sqft.max
        );
      });

      //year_built
      filteredList = _.filter(filteredList, function(item) {
        return (
          item.year_built >= that.filterData.values.year_built.min &&
          item.year_built <= that.filterData.values.year_built.max
        );
      });

      //days_listed
      filteredList = _.filter(filteredList, function(item) {
        return (
          item.days_listed >= that.filterData.values.days_listed.min &&
          item.days_listed <= that.filterData.values.days_listed.max
        );
      });

      //statuses
      filteredList = _.filter(filteredList, function(item) {
        return (
          _.findIndex(that.filterData.values.statuses, function(status) {
            return item.status == status.value;
          }) > -1
        );
      });

      //set keywords
      utilities.setKeywordsForList(
        filteredList,
        "description",
        this.search_keywords
      );

      //investor filters
      filteredList = _.filter(filteredList, function(item) {
        return (
          item.price_to_zestimate <=
            that.filterData.values.price_to_zestimate.threshold &&
          item.keywords_count >= that.filterData.values.keywords_count.threshold
        );
      });

      let resultRows = filteredList;
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
  },
  methods: {
    ...mapActions({
      findProperties: "leadFinder/findProperties",
      findPropertiesIncrementally: "leadFinder/findPropertiesIncrementally",
      fetchProperties: "leadFinder/fetchList",
      expandoUpdate: "leadFinder/expandoUpdate"
    }),
    formatMoney: formatMoney,
    formatNumber: formatNumber,
    findClick: function() {
      this.panelsExpanded = [false, false];
      this.loading = true;

      const request = propertyRequest();
      request.terms = this.url_array;
      request.search_keywords = this.search_keywords;
      request.tag = this.tag;
      request.status = this.status;

      this.findPropertiesIncrementally(request);

      this.urls = "";
    },
    loadExistingClick: function() {
      this.panelsExpanded = [false, false];
      this.loading = true;

      const request = propertyRequest();
      request.search_keywords = this.search_keywords;

      //const query = entityQuery.entityQueryCtor(true, false, 0, 0, 'Date ASC');
      // query.searchFilters.push(entityQuery.searchFilterCtor(false, false, 'seasonMonthId', entityQuery.SearchFilterCondition.Is, parseInt(seasonMonthId), null, null));

      this.fetchProperties(request);
    },
    clearClick: function() {
      this.urls = "";
    },
    toggleOrder() {
      this.pagination.descending = !this.pagination.descending;
    },
    nextSort() {
      let index = this.headers.findIndex(
        h => h.value === this.pagination.sortBy
      );
      index = (index + 1) % this.headers.length;
      index = index === 0 ? index + 1 : index;
      this.pagination.sortBy = this.headers[index].value;
    },
    expandoUpdateTriggered: function(id, item) {
      const request = propertyRequest();
      request.id = id;
      request.input = item;
      request.search_keywords = this.search_keywords;
      this.expandoUpdate(request);
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
  }
};
</script>

<style scoped></style>
