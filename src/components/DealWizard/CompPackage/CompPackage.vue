<template>
  <v-container fluid class="px-0 pt-0">
    <v-container fluid v-if="compPackageStore.finding">
      <v-layout text-xs-center wrap>
        <v-flex xs12>
          <v-progress-circular :width="7" :size="70" color="green" indeterminate></v-progress-circular>
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
                    <v-textarea outline name="urls" label="URLs" v-model="urls" rows="2"></v-textarea>
                  </v-flex>
                  <v-flex xs2>
                    <v-btn block small class="white--text" color="purple" v-on:click="openZillowComps">Zillow </v-btn>
                    <v-btn block small color="success" v-on:click="findClick" :disabled="urls.length == 0">Find </v-btn>
                    <v-btn block small color="error" v-on:click="clearClick" :disabled="urls.length > 0">Clear </v-btn>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs10 class="pt-0">
                    <v-text-field label="Tag" v-model="tag" class="pt-0"></v-text-field>
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
                    <v-select :items="filterData.listItems.amenityCount" v-model="filterData.values.beds.min" label="Min"></v-select>
                  </v-flex>
                  <v-flex xs2>
                    <v-select :items="filterData.listItems.amenityCount" v-model="filterData.values.beds.max" label="Max"></v-select>
                  </v-flex>
                  <v-flex xs2 align-self-center>
                    <h4 class="text-xs-right pr-2">
                      Baths
                    </h4>
                  </v-flex>
                  <v-flex xs2>
                    <v-select :items="filterData.listItems.amenityCount" v-model="filterData.values.baths.min" label="Min"></v-select>
                  </v-flex>
                  <v-flex xs2>
                    <v-select :items="filterData.listItems.amenityCount" v-model="filterData.values.baths.max" label="Max"></v-select>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs2 align-self-center>
                    <h4 class="text-xs-right pr-2">
                      SqFt
                    </h4>
                  </v-flex>
                  <v-flex xs2>
                    <v-text-field label="Min" v-model.number="filterData.values.sqft.min"></v-text-field>
                  </v-flex>
                  <v-flex xs2>
                    <v-text-field label="Max" v-model.number="filterData.values.sqft.max"></v-text-field>
                  </v-flex>
                  <v-flex xs2 align-self-center>
                    <h4 class="text-xs-right pr-2">
                      Built
                    </h4>
                  </v-flex>
                  <v-flex xs2>
                    <v-text-field label="Min" v-model.number="filterData.values.year_built.min"></v-text-field>
                  </v-flex>
                  <v-flex xs2>
                    <v-text-field label="Max" v-model.number="filterData.values.year_built.max"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs2 align-self-center>
                    <h4 class="text-xs-right pr-2">
                      Days Since Sold
                    </h4>
                  </v-flex>
                  <v-flex xs2>
                    <v-text-field label="Min" v-model.number="filterData.values.days_since_sold.min"></v-text-field>
                  </v-flex>
                  <v-flex xs2>
                    <v-text-field label="Max" v-model.number="filterData.values.days_since_sold.max"></v-text-field>
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
                    <h4 class="text-xs-right pr-2">Distance</h4>
                  </v-flex>
                  <v-flex xs2>
                    <v-text-field label="Min" v-model.number="filterData.values.distance.min"></v-text-field>
                  </v-flex>
                  <v-flex xs2>
                    <v-text-field label="Max" v-model.number="filterData.values.distance.max"></v-text-field>
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
    <v-container fluid grid-list-lg class="pb-0" v-if="property != null">
      <v-card>
        <v-card-text>
          <PropertyDetails :property="property" :computed-arv="arv"></PropertyDetails>
        </v-card-text>
      </v-card>
    </v-container>
    <!--<v-alert v-model="showComputedARV" type="success">-->
    <!--Computed ARV: {{ formatMoney(arv, { precision: 0 }) }}-->
    <!--</v-alert>-->
    <v-container fluid>
      <v-data-table
        :headers="headers"
        :pagination.sync="pagination"
        v-model="selectedComps"
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
              :class="['column sortable', header.descending ? 'desc' : 'asc', indexHeaderInStack(header) >= 0 ? 'active' : '']"
              @click="changeSort(header)"
            >
              {{ indexHeaderInStack(header) >= 0 ? indexHeaderInStack(header) + 1 : "" }}
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
              'light-green lighten-2': props.item.status == statuses.TARGET.value
            }"
          >
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td>
              <a :href="props.item.zillow_url" target="_blank">{{ props.item.streetPlusZip }}</a>
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
              {{ props.item.keywords.join(", ") }}
            </td>
            <td class="text-xs-right">{{ props.item.days_since_sold }}</td>
            <td class="text-xs-right">{{ formatNumber(props.item.distance, { precision: 2 }) }} miles</td>
          </tr>
        </template>
        <template v-slot:expand="props">
          <ExpandoProperty :property="props.item"></ExpandoProperty>
        </template>
      </v-data-table>
    </v-container>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapActions } from "vuex";
import { getRequestVariables as propertyRequest } from "../../../api/property";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
import * as statuses from "../../../backend/enums/statuses";
import * as utilities from "../../../backend/utilities/utilities";
import ExpandoProperty from "../../Property/ExpandoProperty";
import PropertyDetails from "../../Property/PropertyDetails";

export default {
  name: "CompPackage",
  components: {
    ExpandoProperty,
    PropertyDetails
  },
  props: {
    property: Object
  },
  data() {
    return {
      selectedComps: [],
      editProperty: this.property,
      urls: "",
      tag: "",
      loading: false,
      denied: false,
      expand: false,
      delay: 500,
      statuses: statuses.statuses,
      panelsExpanded: [true, false],
      search_keywords: ["remodel", "update", "hardwood", "hard wood", "new", "granite"],
      unwanted_keywords: ["manufactured home", "mobile home", "double wide", "auction", "floating"],
      headers: [
        { text: "", value: "id" },
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
        { text: "Keywords", value: "keywords_count" },
        { text: "Days Since Sold", value: "days_since_sold" },
        { text: "Distance", value: "distance" }
      ],
      sortStack: [{ text: "Keywords", value: "keywords_count", descending: true }, { text: "Days Since Sold", value: "days_since_sold", descending: false }],
      // sortStack: [{ text: "Status", value: "status", descending: false }],
      pagination: {
        // sortBy: "keywords_count",
        // descending: true,
        rowsPerPage: 25
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
            min: 1,
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
          statuses: [statuses.statuses.COMP],
          keywords_count: {
            threshold: 0,
            min: 0,
            max: 25
          },
          days_since_sold: {
            min: 0,
            max: 180
          },
          distance: {
            min: 0,
            max: 2
          }
        }
      },
      zillow_comp_url: ""
    };
  },
  watch: {
    property: function(editProperty) {
      this.filterData.values.beds.min = editProperty.beds > 3 ? editProperty.beds - 1 : editProperty.beds;

      this.filterData.values.beds.max = editProperty.beds > 3 ? editProperty.beds + 1 : editProperty.beds;

      this.filterData.values.sqft.min = editProperty.sqft - editProperty.sqft * 0.15;

      this.filterData.values.sqft.max = editProperty.sqft + editProperty.sqft * 0.15;

      const minBeds = this.filterData.values.beds.min;
      const daysSinceSold = this.filterData.values.days_since_sold.max / 30;
      const minSqft = this.filterData.values.sqft.min;
      const maxSqft = this.filterData.values.sqft.max;

      const latitudeOffset = 0.011025;
      const maxLat = editProperty.latitude + latitudeOffset;
      const minLat = editProperty.latitude - latitudeOffset;

      const longitudeOffset = 0.022019;
      const maxLong = editProperty.longitude + longitudeOffset;
      const minLong = editProperty.longitude - longitudeOffset;

      // prettier-ignore
      const url = `https://www.zillow.com/homes/recently_sold/house_type/${minBeds}-_beds/${daysSinceSold}m_days/${minSqft.toFixed(0)}-${maxSqft.toFixed(0)}_size/${maxLat},${maxLong},${minLat},${minLong}_rect/14_zm/`;
      this.zillow_comp_url = url;

      this.tag = `COMPS_${editProperty.zillow_propertyId}`;
    },
    "compPackageStore.list": function() {
      this.loading = false;
    },
    "compPackageStore.denied": function() {
      this.denied = this.leadFinderStore.denied;
    }
  },
  computed: {
    ...mapState({
      compPackageStore: state => state.compPackage
    }),
    url_array: function() {
      return _.filter(this.urls.split(", "), function(url) {
        return url !== "";
      });
    },
    arv: function() {
      if (this.selectedComps.length > 0) {
        return _.meanBy(this.selectedComps, function(comp) {
          return comp.price;
        });
      } else {
        return 0;
      }
    },
    showComputedARV: function() {
      return this.arv > 0;
    },
    filteredProperties: function() {
      let filteredList = _.map(this.compPackageStore.list, function(property) {
        return Object.assign({}, property);
      });

      const that = this;
      const tempBathMin = this.filterData.values.beds.min;

      //remove unwanted
      for (let i = 0; i < that.unwanted_keywords.length; i++) {
        filteredList = _.filter(filteredList, function(item) {
          return item.description.toLowerCase().indexOf(that.unwanted_keywords[i]) == -1;
        });
      }

      //beds
      filteredList = _.filter(filteredList, function(item) {
        return item.beds >= that.filterData.values.beds.min && item.beds <= that.filterData.values.beds.max;
      });

      //baths
      filteredList = _.filter(filteredList, function(item) {
        return item.baths >= that.filterData.values.baths.min && item.baths <= that.filterData.values.baths.max;
      });

      //sqft
      filteredList = _.filter(filteredList, function(item) {
        return item.sqft >= that.filterData.values.sqft.min && item.sqft <= that.filterData.values.sqft.max;
      });

      //year_built
      filteredList = _.filter(filteredList, function(item) {
        return item.year_built >= that.filterData.values.year_built.min && item.year_built <= that.filterData.values.year_built.max;
      });

      //days_listed
      filteredList = _.filter(filteredList, function(item) {
        return item.days_since_sold >= that.filterData.values.days_since_sold.min && item.days_since_sold <= that.filterData.values.days_since_sold.max;
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
      utilities.setKeywordsForList(filteredList, "description", this.search_keywords);

      //investor filters
      filteredList = _.filter(filteredList, function(item) {
        return item.keywords_count >= that.filterData.values.keywords_count.threshold;
      });

      //set
      utilities.setDistanceForList(filteredList, this.property);

      //distance
      filteredList = _.filter(filteredList, function(item) {
        return item.distance >= that.filterData.values.distance.min && item.distance <= that.filterData.values.distance.max;
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
      // const temp = Object.assign({}, this.property);
      // temp.keywords = [];
      // resultRows.push(temp);
      //
      // return [...resultRows];
    }
  },
  methods: {
    ...mapActions({
      findProperties: "compPackage/findProperties",
      findPropertiesIncrementally: "compPackage/findPropertiesIncrementally",
      fetchProperties: "compPackage/fetchList",
      expandoUpdate: "compPackage/expandoUpdate"
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
      request.status = statuses.statuses.COMP.value;

      this.findPropertiesIncrementally(request);

      this.urls = "";
    },
    clearClick: function() {
      this.urls = "";
    },
    openZillowComps: function() {
      window.open(this.zillow_comp_url, "_blank");
    },
    toggleOrder() {
      this.pagination.descending = !this.pagination.descending;
    },
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
  }
};
</script>

<style scoped></style>
