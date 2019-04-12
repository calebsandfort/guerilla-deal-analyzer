<template>
  <v-container fluid grid-list-lg>
    <v-layout row>
      <v-flex xs12>
        {{ property.streetAddress }}
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapActions } from "vuex";
import { getRequestVariables as propertyRequest } from "../../api/property";
import formatMoney from "accounting-js/lib/formatMoney";
import formatNumber from "accounting-js/lib/formatNumber";
import * as statuses from "../../common/enums/statuses";
import * as utilities from "../../utilities/utilities";
import ExpandoProperty from "../Property/ExpandoProperty";
import PropertyDetails from "../Property/PropertyDetails";

export default {
  name: "CompPackageV2",
  components: {
    // ExpandoProperty,
    // PropertyDetails
  },
  props: {},
  computed: {
    ...mapState({
      dealWizardStore: state => state.dealWizard,
      property: state => state.dealWizard.item
    })
  },
  watch: {
    property: function(editProperty) {
      console.log("watch");
    }
  },
  methods: {
    formatMoney: formatMoney,
    formatNumber: formatNumber
  }
};
</script>

<style scoped></style>
