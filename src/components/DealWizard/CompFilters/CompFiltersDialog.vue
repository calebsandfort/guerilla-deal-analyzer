<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn flat small color="primary" v-on="on">Filter</v-btn>
    </template>
    <v-card>
      <v-card-title class="teal white--text">
        <span class="headline">Comp Filters</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md class="py-0">
          <MinMaxRow
            label="Beds"
            :min.sync="localCompFilter.minBeds"
            :max.sync="localCompFilter.maxBeds"
            :items="dealWizardStore.listItems.amenityCount"
          ></MinMaxRow>
          <MinMaxRow
            label="Sqft"
            :min.sync="localCompFilter.minSqft"
            :max.sync="localCompFilter.maxSqft"
            :items="dealWizardStore.listItems.percentages"
          ></MinMaxRow>
          <MinMaxRow
            label="Lot Size"
            :min.sync="localCompFilter.minLotSqft"
            :max.sync="localCompFilter.maxLotSqft"
            :items="dealWizardStore.listItems.percentages"
          ></MinMaxRow>
          <MinMaxRow
            label="Year Built"
            :min.sync="localCompFilter.minYearBuilt"
            :max.sync="localCompFilter.maxYearBuilt"
            :items="dealWizardStore.listItems.years"
          ></MinMaxRow>
          <v-layout row>
            <v-flex xs6>
              <v-select
                :items="dealWizardStore.listItems.amenityCount"
                item-text="text"
                item-value="value"
                v-model="localCompFilter.minBaths"
                label="Min Baths"
              ></v-select>
            </v-flex>
            <v-flex xs6>
              <v-select
                :items="dealWizardStore.listItems.distances"
                item-text="text"
                item-value="value"
                v-model="localCompFilter.searchDistance"
                label="Search Distance"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" class="white--text" @click="dialog = false"
          >Close</v-btn
        >
        <v-btn color="blue darken-1" class="white--text" @click="apply"
          >Apply</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import * as utilities from "../../../utilities/utilities";
import MinMaxRow from "./MinMaxRow";

export default {
  name: "CompFiltersDialog",
  components: {
    MinMaxRow
  },
  data() {
    return {
      dialog: false,
      localCompFilter: utilities.defaultCompFilter(),
      min: 0
    };
  },
  watch: {
    dialog: function(val) {
      this.localCompFilter = Object.assign({}, this.compFilter);
    }
  },
  computed: {
    ...mapState({
      dealWizardStore: state => state.dealWizard,
      compFilter: state => state.dealWizard.compFilter
    })
  },
  methods: {
    ...mapMutations({
      setCompFilter: "dealWizard/setCompFilter"
    }),
    ...mapActions({
      setField: "dealWizard/setField"
    }),
    print: function() {
      console.log(this.localCompFilter);
    },
    apply: function() {
      this.dialog = false;
      this.setCompFilter(this.localCompFilter);
    }
  }
};
</script>

<style scoped></style>
