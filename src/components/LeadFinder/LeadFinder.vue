<template>
  <v-container fluid class="px-0 pt-0">
    <Toolbar back-path="/"></Toolbar>
    <v-content>
      <v-container fluid class="pb-0">
        <v-expansion-panel expand>
          <v-expansion-panel-content>
            <template v-slot:header
              ><h3>URLs</h3>
            </template>
            <v-card>
              <v-card-text>
                <v-layout row>
                  <v-flex xs10 class="pr-2">
                    <v-textarea
                      outline
                      name="urls"
                      label="URLs"
                      v-model="urls"
                      rows="4"
                    ></v-textarea>
                  </v-flex>
                  <v-flex xs2 class="pl-2">
                    <v-btn
                      block
                      small
                      color="success"
                      v-on:click="findClick"
                      :disabled="urls.length == 0"
                      >Find</v-btn
                    >
                    <v-btn
                      block
                      small
                      color="info"
                      v-on:click="loadExistingClick"
                      >Load Existing</v-btn
                    >
                    <v-btn
                      block
                      small
                      color="error"
                      v-on:click="clearClick"
                      :disabled="urls.length > 0"
                      >Clear</v-btn
                    >
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header
              ><h3>Filters</h3>
            </template>
            <v-card>
              <v-card-text>
                <v-layout row>
                  <v-flex xs2 align-self-center class="pr-2 pl-4">
                    <h4>
                      Beds
                    </h4>
                  </v-flex>
                  <v-flex xs2 class="px-2">
                    <v-select
                      :items="filterData.listItems.amenityCount"
                      v-model="filterData.values.beds.min"
                      label="Min"
                    ></v-select>
                  </v-flex>
                  <v-flex xs2 class="px-2">
                    <v-select
                      :items="filterData.listItems.amenityCount"
                      v-model="filterData.values.beds.max"
                      label="Max"
                    ></v-select>
                  </v-flex>
                  <v-flex xs2 align-self-center class="pr-2 pl-4">
                    <h4>
                      Baths
                    </h4>
                  </v-flex>
                  <v-flex xs2 class="px-2">
                    <v-select
                      :items="filterData.listItems.amenityCount"
                      v-model="filterData.values.baths.min"
                      label="Min"
                    ></v-select>
                  </v-flex>
                  <v-flex xs2 class="px-2">
                    <v-select
                      :items="filterData.listItems.amenityCount"
                      v-model="filterData.values.baths.max"
                      label="Max"
                    ></v-select>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs2 align-self-center class="pr-2 pl-4">
                    <h4>
                      SqFt
                    </h4>
                  </v-flex>
                  <v-flex xs2 class="px-2">
                    <v-text-field
                      label="Min"
                      v-model.number="filterData.values.sqft.min"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs2 class="px-2">
                    <v-text-field
                      label="Max"
                      v-model.number="filterData.values.sqft.max"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs2 align-self-center class="pr-2 pl-4">
                    <h4>
                      Built
                    </h4>
                  </v-flex>
                  <v-flex xs2 class="px-2">
                    <v-text-field
                      label="Min"
                      v-model.number="filterData.values.year_built.min"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs2 class="px-2">
                    <v-text-field
                      label="Max"
                      v-model.number="filterData.values.year_built.max"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs2 align-self-center class="pr-2 pl-4">
                    <h4>
                      Days Listed
                    </h4>
                  </v-flex>
                  <v-flex xs2 class="px-2">
                    <v-text-field
                      label="Min"
                      v-model.number="filterData.values.days_listed.min"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs2 class="px-2">
                    <v-text-field
                      label="Max"
                      v-model.number="filterData.values.days_listed.max"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs2 align-self-center class="pr-2 pl-4">
                    <h4>
                      Ratio
                    </h4>
                  </v-flex>
                  <v-flex xs4 class="px-2">
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
                  <v-flex xs2 align-self-center class="pr-2 pl-4">
                    <h4>
                      Keywords
                    </h4>
                  </v-flex>
                  <v-flex xs4 class="px-2">
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
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-container>
      <v-container fluid>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          mustSort
          :loading="loading"
          :items="filteredProperties"
          class="elevation-1"
        >
          <template v-slot:items="props">
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
            <td class="text-xs-right">{{ props.item.keywords.join(", ") }}</td>
            <td class="text-xs-right">{{ props.item.days_listed }}</td>
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
import { getRequestVariables as propertyRequest } from "../../api/property";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
import debounce from "v-debounce";

export default {
  name: "LeadFinder",
  components: {
    Toolbar
  },
  directives: {
    debounce
  },
  data() {
    return {
      urls: "",
      loading: false,
      delay: 500,
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
        "remodeled"
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
        { text: "Days Listed", value: "days_listed" }
      ],
      pagination: {
        sortBy: "keywords_count",
        descending: true,
        rowsPerPage: 10
      },
      filterData: {
        listItems: {
          amenityCount: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
          keywords_count: {
            threshold: 2,
            min: 0,
            max: 25
          },
          days_listed: {
            min: 0,
            max: 730
          }
        }
      }
    };
  },
  watch: {
    "leadFinderStore.list": function() {
      this.loading = false;
    }
  },
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
      let filteredList = [...this.leadFinderStore.list];

      const that = this;
      const tempBathMin = this.filterData.values.beds.min;

      //remove unwanted
      filteredList = _.filter(filteredList, function(item) {
        return item.price > 0 && item.price_to_zestimate < 1000;
      });

      for (let i = 0; i < this.unwanted_keywords; i++) {
        filteredList = _.filter(filteredList, function(item) {
          return (
            item.description.toLowerCase().indexOf(this.unwanted_keywords[i]) ==
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

      //investor filters
      filteredList = _.filter(filteredList, function(item) {
        return (
          item.price_to_zestimate <=
            that.filterData.values.price_to_zestimate.threshold &&
          item.keywords_count >= that.filterData.values.keywords_count.threshold
        );
      });

      return filteredList;
    }
  },
  methods: {
    ...mapActions({
      findProperties: "leadFinder/findProperties",
      findPropertiesIncrementally: "leadFinder/findPropertiesIncrementally",
      fetchProperties: "leadFinder/fetchList"
    }),
    formatMoney: formatMoney,
    formatNumber: formatNumber,
    findClick: function() {
      this.loading = true;

      const request = propertyRequest();
      request.terms = this.url_array;
      request.search_keywords = this.search_keywords;

      this.findPropertiesIncrementally(request);

      this.urls = "";
    },
    loadExistingClick: function() {
      this.loading = true;

      const request = propertyRequest();
      request.search_keywords = this.search_keywords;

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
    }
  }
};
</script>

<style scoped></style>
