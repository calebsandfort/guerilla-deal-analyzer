<template>
  <v-container fluid class="pa-0">
    <Toolbar back-path="/"></Toolbar>
    <v-content>
      <v-card>
        <v-tabs color="pink" dark slider-color="yellow">
          <v-tab :key="1" ripple>
            Map
          </v-tab>
          <v-tab :key="2" ripple>
            Table
          </v-tab>
          <v-tab-item :key="1">
            <v-container fluid grid-list-lg>
              <v-layout row>
                <v-flex xs12>
                  <GmapMap
                    ref="mapRef"
                    :center="map_center"
                    :zoom="12"
                    map-type-id="roadmap"
                    :style="{
                      width: '100%',
                      height: `${mapHeight}px`
                    }"
                  >
                    <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen = false">
                      {{ infoContent }} yo
                    </GmapInfoWindow>
                    <template v-for="(zipcodePolygon, idx) in zipcodePolygons">
                      <GmapPolygon
                        :key="zipcodePolygon.zipcode"
                        :path="zipcodePolygon.path"
                        :options="zipcodePolygon.options"
                        :clickable="true"
                        @click="toggleInfoWindow(zipcodePolygon, idx)"
                      ></GmapPolygon>
                    </template>
                  </GmapMap>
                </v-flex>
              </v-layout>
            </v-container>
            <v-container fluid text-xs-center class="pt-0">
              <v-layout row>
                <v-flex xs6>
                  <v-card style="border-radius: 0;">
                    <v-card-text class="px-0" style="border-radius: 0;"><span class="subheading font-weight-medium">Market Type</span></v-card-text>
                  </v-card>
                </v-flex>
                <v-flex v-for="i in 10" :key="`colorScale${i}`" xs6>
                  <v-card dark :color="heatColorScaleString[i - 1]" style="border-radius: 0;">
                    <v-card-text class="px-0" style="border-radius: 0;"
                      ><span class="subheading font-weight-medium">{{ tempLabel(i) }}</span></v-card-text
                    >
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
            <v-dialog v-model="zipcodeModal" max-width="400">
              <v-card>
                <v-card-title class="headline primary white--text">Zipcode Info</v-card-title>

                <v-card-text>
                  <v-container fluid class="py-0" grid-list-md>
                    <v-layout row>
                      <v-flex xs6 class="font-weight-medium">Zipcode</v-flex>
                      <v-flex xs6 class="font-weight-regular">{{ currentZipcode.zipcode }}</v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs6 class="font-weight-medium">Market Temperature</v-flex>
                      <v-flex xs6 class="font-weight-regular">{{ tempLabel(Math.floor(currentZipcode.marketTemperature / 10)) }}</v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs6 class="font-weight-medium">Median Home Value</v-flex>
                      <v-flex xs6 class="font-weight-regular">{{ formatMoney(currentZipcode.medianHomeValue, { precision: 0 }) }}</v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" class="white--text" @click="zipcodeModal = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-tab-item>
          <v-tab-item :key="2">
            <ZipcodeTable></ZipcodeTable>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-content>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import Toolbar from "../Toolbar";
import * as mathjs from "mathjs";
import Coord from "../../utilities/Coord";
import { gmapApi } from "vue2-google-maps";
import ColorHelper from "../../utilities/ColorHelper";
import { formatMoney } from "accounting-js";
import ZipcodeTable from "./ZipcodeTable";

export default {
  name: "Research",
  components: {
    Toolbar,
    ZipcodeTable
  },
  props: {},
  data() {
    return {
      mapHeight: 600,
      infoContent: "",
      infoWindowPos: null,
      infoWinOpen: false,
      currentMidx: 0,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: 0
        }
      },
      zipcodeModal: false
    };
  },
  computed: {
    ...mapState({
      zipcodes: state => state.research.zipcodes,
      research: state => state.research
    }),
    heatColorScaleString: function() {
      return ColorHelper.heatColorScaleString;
    },
    google: gmapApi,
    map_center: function() {
      return {
        lat: 45.5155,
        lng: -122.6793
      };
    },
    currentZipcode: function() {
      return this.zipcodes[this.currentMidx];
    },
    zipcodePolygons: function() {
      const zp = _.map(this.zipcodes, function(x) {
        const tempColor = ColorHelper.getColorScaleColor(x.marketTemperature);
        return {
          zipcode: x.zipcode,
          center: x.center,
          path: x.geometry,
          options: {
            strokeColor: tempColor,
            strokeOpacity: 1,
            fillColor: tempColor,
            fillOpacity: 0.5,
            geodesic: true
          }
        };
      });

      return zp;
    }
  },
  watch: {
    // zipcodes: function() {
    //   console.log(this.zicpodes[0].center);
    //   return this.zicpodes[0].center;
    // }
  },
  mounted() {
    const that = this;
    const availableHeight = window.$(window).height() - 240;
    that.mapHeight = Math.max(300, availableHeight);

    window.$(window).resize(
      _.debounce(function(args) {
        const availableHeight = window.$(window).height() - 240;
        that.mapHeight = Math.max(300, availableHeight);
      })
    );

    this.$refs.mapRef.$mapPromise.then(map => {
      const b = new that.google.maps.LatLngBounds();

      const allCoords = _.chain(this.zipcodes)
        .map(function(x) {
          return x.geometry;
        })
        .flattenDeep()
        .value();

      const n = _.maxBy(allCoords, function(x) {
        return x.lat;
      }).lat;

      const s = _.minBy(allCoords, function(x) {
        return x.lat;
      }).lat;

      const e = _.maxBy(allCoords, function(x) {
        return x.lng;
      }).lng;

      const w = _.minBy(allCoords, function(x) {
        return x.lng;
      }).lng;

      b.extend({
        lat: s,
        lng: w
      });
      b.extend({
        lat: n,
        lng: e
      });
      console.log("fitBounds");
      map.fitBounds(b, 15);
    });
  },
  methods: {
    formatMoney,
    tempLabel: function(i) {
      return i <= 3 ? "Buyers" : i >= 8 ? "Sellers" : "Neutral";
    },
    toggleInfoWindow: function(zipcodePolygon, idx) {
      this.currentMidx = idx;
      this.zipcodeModal = true;
      // this.infoWindowPos = zipcodePolygon.center;
      // //this.infoContent = marker.infoText;
      // //check if its the same marker that was selected if yes toggle
      // if (this.currentMidx == idx) {
      //   this.infoWinOpen = !this.infoWinOpen;
      // }
      // //if different marker set infowindow to open and reset current marker index
      // else {
      //   this.infoWinOpen = true;
      //   this.currentMidx = idx;
      // }
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
