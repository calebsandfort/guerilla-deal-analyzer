<template>
  <v-container fluid grid-list-lg class="pa-0">
    <ReportHeader :header="`${property.streetAddress}`"></ReportHeader>
    <v-layout row v-show="false">
      <v-flex xs12>
        {{ this.staticMapUrl }}
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs4>
        <img :src="encodedImage" class="image" width="100%" />
      </v-flex>
      <v-flex xs8 class="propertyDetails">
        <v-layout row wrap>
          <v-flex xs3 class="font-weight-medium">
            Price
          </v-flex>
          <v-flex xs3>
            {{ formatMoney(property.price, { precision: 0 }) }}
          </v-flex>
          <v-flex xs3 class="font-weight-medium">
            sqft
          </v-flex>
          <v-flex xs3>
            {{ formatNumber(property.sqft, { precision: 0 }) }}
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs3 class="font-weight-medium">
            Beds
          </v-flex>
          <v-flex xs3>
            {{ property.beds }}
          </v-flex>
          <v-flex xs3 class="font-weight-medium">
            Baths
          </v-flex>
          <v-flex xs3>
            {{ property.baths }}
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs3 class="font-weight-medium">
            Days On
          </v-flex>
          <v-flex xs3>
            {{ property.days_listed }}
          </v-flex>
          <v-flex xs3 class="font-weight-medium">
            Built
          </v-flex>
          <v-flex xs3>
            {{ property.year_built }}
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12 class="py-0">
            <v-divider></v-divider>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs3 class="font-weight-medium">
            Purchase
          </v-flex>
          <v-flex xs3>
            {{ formatMoney(dealAnalysis.DF_PurchasePrice, { precision: 0 }) }}
          </v-flex>
          <v-flex xs3 class="font-weight-medium">
            Rehab
          </v-flex>
          <v-flex xs3>
            {{ formatMoney(dealAnalysis.DF_RepairCosts, { precision: 0 }) }}
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs3 class="font-weight-medium">
            ARV
          </v-flex>
          <v-flex xs3>
            {{ formatMoney(dealAnalysis.DF_ARV, { precision: 0 }) }}
          </v-flex>
          <v-flex xs3 class="font-weight-medium">
            ROI
          </v-flex>
          <v-flex xs3> {{ formatNumber(dealAnalysis.SNAP_ROI * 100, { precision: 2 }) }}% </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs3 class="font-weight-medium">
            Ask Diff $
          </v-flex>
          <v-flex
            xs3
            :class="{
              'text--darken-3': true,
              'red--text': dealAnalysis.SNAP_DiscountPercent < -discountThreshold,
              'green--text': dealAnalysis.SNAP_DiscountPercent > discountThreshold
            }"
          >
            {{
              formatMoney(dealAnalysis.SNAP_DiscountCost, {
                symbol: "$",
                precision: 0,
                format: {
                  zero: "%v%s",
                  pos: "%s%v",
                  neg: "(%s%v)"
                }
              })
            }}
          </v-flex>
          <v-flex xs3 class="font-weight-medium">
            Ask Diff %
          </v-flex>
          <v-flex
            xs3
            :class="{
              'text--darken-3': true,
              'red--text': dealAnalysis.SNAP_DiscountPercent < -discountThreshold,
              'green--text': dealAnalysis.SNAP_DiscountPercent > discountThreshold
            }"
          >
            {{
              formatMoney(dealAnalysis.SNAP_DiscountPercent * 100, {
                symbol: "%",
                precision: 0,
                format: {
                  zero: "%v%s",
                  pos: "%v%s",
                  neg: "(%v%s)"
                }
              })
            }}
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        {{ property.description }}
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 class="pb-1">
        <h5 class="headline font-weight-medium blue-grey--text text--darken-2">Comps & ARV</h5>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 class="py-0">
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <v-data-table
          :headers="compHeaders"
          :pagination.sync="pagination"
          disable-initial-sort
          hide-actions
          :items="comps"
          item-key="zillow_propertyId"
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
            <tr :key="props.item.id">
              <td class="text-xs-left">{{ props.index + 1 }}</td>
              <td>
                <a :href="props.item.zillow_url" target="_blank">{{ props.item.streetAddress }}</a>
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
              <td class="text-xs-right">{{ props.item.days_since_sold }} days</td>
              <td class="text-xs-right">{{ formatNumber(props.item.distance, { precision: 2 }) }} miles</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs8>
        <img :src="mapImage" class="image" width="100%" />
      </v-flex>
      <v-flex xs4>
        <v-container fluid>
          <v-layout column>
            <v-flex xs12>
              <div style="height: 300px">
                <v-layout align-center justify-center row fill-height>
                  <div class="display-2 font-weight-bold">{{ formatMoney(arv, { precision: 0 }) }}</div>
                </v-layout>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import ReportHeader from "./ReportHeader";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
import colors from "vuetify/es5/util/colors";
import buildUrl from "build-url";
import qs from "qs";

export default {
  name: "PropertyReport",
  components: {
    ReportHeader
  },
  props: {},
  mounted() {
    this.encodeImage({
      image_url: this.property.image_urls_list[0],
      field: "encodedImage"
    });
  },
  data() {
    return {
      compHeaders: [
        {
          text: "idx",
          align: "left",
          value: "index"
        },
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
        { text: "Sold", value: "days_since_sold" },
        { text: "Distance", value: "distance" }
      ],
      pagination: {
        rowsPerPage: -1
      },
      search_path_options: {
        strokeColor: colors.purple.lighten2,
        strokeOpacity: 0.5,
        geodesic: true
      }
    };
  },
  computed: {
    ...mapState({
      property: state => state.dealWizard.item,
      dealAnalysis: state => state.dealWizard.dealAnalysis,
      comps: state => state.dealWizard.dealComps,
      compFilter: state => state.dealWizard.compFilter,
      arv: state => state.dealWizard.arv,
      encodedImage: state => state.dealWizard.encodedImage,
      mapImage: state => state.dealWizard.mapImage,
      discountThreshold: state => state.dealWizard.discountThreshold
    }),
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
    staticMapUrl: function() {
      let url = buildUrl("https://maps.googleapis.com", {
        path: "maps/api/staticmap",
        queryParams: {
          center: `${this.property.latitude},${this.property.longitude}`,
          zoom: 13,
          size: "488x300",
          markers: `color:red|size:mid|${this.property.latitude},${this.property.longitude}`,
          key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY
        }
      });

      if (this.comps.length > 0) {
        for (let i = 0; i < this.comps.length; i++) {
          const c = this.comps[i];
          url +=
            "&" +
            qs.stringify({
              markers: `color:green|size:mid|label:${i + 1}|${c.latitude},${c.longitude}`
            });
        }
      }

      this.encodeImage({
        image_url: url,
        field: "mapImage"
      });

      return url;
    }
    // example: function() {return {}}
  },
  watch: {
    // comps: function () {}
  },
  methods: {
    formatMoney: formatMoney,
    formatNumber: formatNumber,
    // ...mapMutations({
    //   example: "example/example",
    // }),
    ...mapActions({
      encodeImage: "dealWizard/encodeImage"
    })
    // example() {}
  }
};
</script>

<style scoped>
.propertyDetails .flex {
  padding: 5px !important;
}
</style>
