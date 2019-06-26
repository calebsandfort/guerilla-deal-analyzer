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
          <MinMaxRowSelect
            label="Beds"
            :min.sync="localCompFilter.minBeds"
            :max.sync="localCompFilter.maxBeds"
            :items="dealWizardStore.listItems.amenityCount"
          ></MinMaxRowSelect>
          <!--          <v-layout row>-->
          <!--            <v-flex xs6>-->
          <!--              <VuetifyNumeric-->
          <!--                field="minSqft"-->
          <!--                label="Min Sqft"-->
          <!--                :value="localCompFilter.minSqft"-->
          <!--                v-on:input="fieldChangedNumber"-->
          <!--              >-->
          <!--              </VuetifyNumeric>-->
          <!--            </v-flex>-->
          <!--            <v-flex xs6>-->
          <!--              <VuetifyNumeric-->
          <!--                field="maxSqft"-->
          <!--                label="Max Sqft"-->
          <!--                :value="localCompFilter.maxSqft"-->
          <!--                v-on:input="fieldChangedNumber"-->
          <!--              >-->
          <!--              </VuetifyNumeric>-->
          <!--            </v-flex>-->
          <!--          </v-layout>-->
          <MinMaxRowNumeric label="Sqft" :min.sync="localCompFilter.minSqft" :max.sync="localCompFilter.maxSqft"></MinMaxRowNumeric>
          <MinMaxRowSelect
            label="Lot Size"
            :min.sync="localCompFilter.minLotSqft"
            :max.sync="localCompFilter.maxLotSqft"
            :items="dealWizardStore.listItems.percentages"
          ></MinMaxRowSelect>
          <MinMaxRowSelect
            label="Year Built"
            :min.sync="localCompFilter.minYearBuilt"
            :max.sync="localCompFilter.maxYearBuilt"
            :items="dealWizardStore.listItems.years"
          ></MinMaxRowSelect>
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
        <v-btn color="red darken-1" class="white--text" @click="dialog = false">Close</v-btn>
        <v-btn color="blue darken-1" class="white--text" @click="apply">Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import * as utilities from "../../../../backend/utilities/utilities";
import MinMaxRowSelect from "./MinMaxRowSelect";
import MinMaxRowNumeric from "./MinMaxRowNumeric";
import VuetifyNumeric from "../../../Shared/VuetifyNumeric";
import _ from "lodash";

export default {
  name: "CompFiltersDialog",
  components: {
    MinMaxRowSelect,
    MinMaxRowNumeric,
    VuetifyNumeric
  },
  data() {
    return {
      dialog: false,
      localCompFilter: utilities.defaultCompFilter(),
      min: 0
    };
  },
  mounted() {
    if (this.showCompFilterDialog) {
      this.dialog = true;
    }
  },
  watch: {
    dialog: function() {
      this.localCompFilter = Object.assign({}, this.compFilter);
    },
    showCompFilterDialog: function(newVal, oldVal) {
      this.dialog = newVal;
    }
  },
  computed: {
    ...mapState({
      dealWizardStore: state => state.dealWizard,
      compFilter: state => state.dealWizard.compFilter,
      showCompFilterDialog: state => state.dealWizard.showCompFilterDialog
    })
  },
  methods: {
    ...mapMutations({
      setCompFilter: "dealWizard/setCompFilter",
      setShowCompFilterDialog: "dealWizard/setShowCompFilterDialog"
    }),
    ...mapActions({
      setField: "dealWizard/setField"
    }),
    print: function() {
      console.log(this.localCompFilter);
    },
    cancel: function() {
      this.showCompFilterDialog(false);
    },
    apply: function() {
      this.showCompFilterDialog(false);
      this.setCompFilter(this.localCompFilter);
    },
    fieldChangedNumber: _.debounce(function(args) {
      _.set(this.localCompFilter, args.field, args.value);
    }, 1000)
  }
};
</script>

<style scoped></style>
