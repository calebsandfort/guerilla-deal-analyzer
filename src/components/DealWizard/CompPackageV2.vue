<template>
  <v-container fluid grid-list-lg>
    <v-layout row>
      <v-flex xs8>
        <GmapMap
          :center="map_center"
          :zoom="13"
          map-type-id="roadmap"
          style="width: 100%; height: 400px"
        >
          <GmapPolyline
            :path="search_path"
            :options="search_path_options"
          ></GmapPolyline>
          <GmapMarker
            key="center"
            :position="map_center"
            :icon="
              `http://maps.google.com/mapfiles/ms/icons/${engagements.getMarkerColor(
                engagements.engagements.ANALYSIS.value
              )}-dot.png`
            "
            :clickable="true"
            @click="markerClicked"
          ></GmapMarker>
          <GmapMarker
            :key="comp.id"
            v-for="comp in filteredComps"
            :position="{ lat: comp.latitude, lng: comp.longitude }"
            :icon="
              `http://maps.google.com/mapfiles/ms/icons/${engagements.getMarkerColor(
                comp.engagement
              )}-dot.png`
            "
            :clickable="true"
            @click="compClicked(comp.id)"
            @mouseover="compMouseover(comp.id)"
            @mouseout="compMouseout(comp.id)"
          />
        </GmapMap>
      </v-flex>
      <v-flex xs4>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              name="arv_average"
              label="Avg Sale Price"
              prefix="$"
              v-model.number="arv_average"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              name="arv_pricePerSqft"
              label="Avg Price Per Sqft"
              prefix="$"
              v-model.number="arv_pricePerSqft"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              name="arv"
              label="ARV"
              mask="#######"
              prefix="$"
              :value="arv"
              v-on:keyup="fieldChangedNumber"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-btn
              :color="onlyShowSelected ? 'primary' : 'success'"
              block
              class="white--text"
              @click="onlyShowSelected = !onlyShowSelected"
              >{{ onlyShowSelected ? "Show All" : "Show Selected" }}</v-btn
            >
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :pagination.sync="pagination"
          v-model="selectedComps"
          disable-initial-sort
          mustSort
          :loading="loading"
          :items="filteredComps"
          item-key="zillow_propertyId"
          style="max-height: 550px; overflow: auto;"
        >
          <template slot="headers" slot-scope="props">
            <tr>
              <th
                v-for="(header, index) in props.headers"
                :key="`header_${index}`"
                :class="[
                  'column sortable',
                  header.descending ? 'desc' : 'asc',
                  indexHeaderInStack(header) >= 0 ? 'active' : ''
                ]"
                @click="changeSort(header)"
              >
                <template v-if="index == 0">
                  <CompFiltersDialog></CompFiltersDialog>
                </template>
                <template v-else>
                  {{
                    indexHeaderInStack(header) >= 0
                      ? indexHeaderInStack(header) + 1
                      : ""
                  }}
                  <v-icon small>arrow_upward</v-icon>

                  {{ header.text }}
                </template>
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr
              :key="props.item.id"
              @mouseover="compMouseover(props.item.id)"
              @mouseout="compMouseout(props.item.id)"
              v-bind:class="{
                'yellow lighten-2':
                  props.item.engagement == engagements.engagements.HOVER.value,
                'blue lighten-3':
                  props.item.engagement ==
                  engagements.engagements.SPOTLIGHT.value
              }"
            >
              <td class="text-xs-left">
                <v-layout row>
                  <v-flex xs3 align-self-center>
                    <v-checkbox
                      v-model="props.selected"
                      primary
                      hide-details
                    ></v-checkbox>
                  </v-flex>
                  <v-flex xs3>
                    <v-btn
                      flat
                      icon
                      color="primary"
                      @click="compClicked(props.item.id)"
                    >
                      <v-icon>pageview</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </td>
              <td>
                <a :href="props.item.zillow_url" target="_blank">{{
                  props.item.streetAddress
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
                {{ props.item.keywords.join(", ") }}
              </td>
              <td class="text-xs-right">{{ props.item.days_since_sold }}</td>
              <td class="text-xs-right">
                {{ formatNumber(props.item.distance, { precision: 2 }) }} miles
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
import { getRequestVariables as propertyRequest } from "../../api/property";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
import * as statuses from "../../backend/enums/statuses";
import * as engagements from "../../backend/enums/engagements";
import * as utilities from "../../backend/utilities/utilities";
import ExpandoProperty from "../Property/ExpandoProperty";
import PropertyDetails from "../Property/PropertyDetails";
import CompFiltersDialog from "./CompFilters/CompFiltersDialog";
import colors from "vuetify/es5/util/colors";

export default {
  name: "CompPackageV2",
  components: {
    CompFiltersDialog
    // ExpandoProperty,
    // PropertyDetails
  },
  props: {},
  data() {
    return {
      loading: false,
      headers: [
        { text: "", value: "id" },
        {
          text: "Address",
          align: "left",
          sortable: false,
          value: "streetAddress"
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
      sortStack: [
        { text: "Keywords", value: "keywords_count", descending: true },
        { text: "Days Since Sold", value: "days_since_sold", descending: false }
      ],
      // sortStack: [{ text: "Status", value: "status", descending: false }],
      pagination: {
        // sortBy: "keywords_count",
        // descending: true,
        rowsPerPage: 25
      },
      onlyShowSelected: false,
      localComps: [],
      selectedComps: [],
      engagements: engagements,
      search_path_options: {
        strokeColor: colors.purple.lighten2,
        strokeOpacity: 0.5,
        geodesic: true
      }
    };
  },
  created() {
    if (this.localComps.length == 0 && this.comps.length > 0) {
      this.localComps = _.map(this.comps, function(property) {
        return Object.assign({}, property);
      });
    }
  },
  computed: {
    ...mapState({
      dealWizardStore: state => state.dealWizard,
      property: state => state.dealWizard.item,
      comps: state => state.dealWizard.comps,
      dealComps: state => state.dealWizard.dealComps,
      compFilter: state => state.dealWizard.compFilter,
      arv: state => state.dealWizard.arv
    }),
    filteredComps: function() {
      const that = this;

      let filteredList = _.map(this.localComps, function(property) {
        return Object.assign({}, property);
      });

      if (this.onlyShowSelected && that.selectedComps.length > 0) {
        filteredList = _.filter(filteredList, function(item1) {
          const foundItem = _.find(that.selectedComps, function(item2) {
            return item1.id == item2.id;
          });

          return foundItem != null;
        });
      }

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
    },
    map_center: function() {
      return {
        lat: this.property.latitude,
        lng: this.property.longitude
      };
    },
    search_path: function() {
      const longitudeOffset = (1 / 49) * this.compFilter.searchDistance;
      const maxLon = this.property.longitude + longitudeOffset;
      const minLon = this.property.longitude - longitudeOffset;

      const latitudeOffset = (1 / 69) * this.compFilter.searchDistance;
      const maxLat = this.property.latitude + latitudeOffset;
      const minLat = this.property.latitude - latitudeOffset;

      const poly = [
        { lng: maxLon, lat: maxLat },
        { lng: maxLon, lat: minLat },
        { lng: minLon, lat: minLat },
        { lng: minLon, lat: maxLat },
        { lng: maxLon, lat: maxLat }
      ];

      return poly;
    },
    arv_average: function() {
      return this.selectedComps.length == 0
        ? 0
        : Math.floor(
            _.meanBy(this.selectedComps, function(comp) {
              return comp.price;
            })
          );
    },
    arv_pricePerSqft: function() {
      return (
        (this.selectedComps.length == 0
          ? 0
          : Math.floor(
              _.meanBy(this.selectedComps, function(comp) {
                return comp.pricePerSqft;
              })
            )) * this.property.sqft
      );
    }
  },
  watch: {
    comps: function() {
      this.localComps = _.map(this.comps, function(property) {
        return Object.assign({}, property);
      });
    },
    "dealWizardStore.compFilter": function() {
      this.findComps(propertyRequest());
    },
    selectedComps: function() {
      this.setDealComps(
        _.map(this.selectedComps, function(property) {
          return Object.assign({}, property);
        })
      );
    }
  },
  methods: {
    ...mapMutations({
      setSpotlightComp: "dealWizard/setSpotlightItem",
      setDealComps: "dealWizard/setDealComps"
    }),
    ...mapActions({
      setField: "dealWizard/setField",
      findComps: "dealWizard/findComps"
    }),
    formatMoney: formatMoney,
    formatNumber: formatNumber,
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
    },
    markerClicked() {
      alert("markerClicked");
    },
    compClicked(id) {
      _.each(
        _.filter(this.localComps, function(c1) {
          return c1.engagement == engagements.engagements.SPOTLIGHT.value;
        }),
        function(c2) {
          c2.engagement = engagements.engagements.NONE;
        }
      );

      const comp = _.find(this.localComps, function(c) {
        return c.id == id;
      });

      comp.engagement = engagements.engagements.SPOTLIGHT.value;
      this.setSpotlightComp(comp.id);
    },
    compMouseover(id) {
      const comp = _.find(this.localComps, function(c) {
        return c.id == id;
      });

      if (comp.engagement != engagements.engagements.SPOTLIGHT.value) {
        comp.engagement = engagements.engagements.HOVER.value;
      }
    },
    compMouseout(id) {
      const comp = _.find(this.localComps, function(c) {
        return c.id == id;
      });

      if (comp.engagement != engagements.engagements.SPOTLIGHT.value) {
        comp.engagement = engagements.engagements.NONE.value;
      }
    },
    fieldChangedNumber: _.debounce(function(event) {
      this.setField({
        name: event.target.name,
        v: utilities.tryParseNumber(event.target.value, 0)
      });
    }, 1000)
  }
};
</script>

<style scoped></style>
