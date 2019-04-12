<template>
  <v-container fluid class="px-0 pt-0">
    <Toolbar back-path="/"></Toolbar>
    <v-content>
      <v-container fluid v-if="sandboxStore.finding">
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
      <v-container fluid grid-list-lg>
        <v-layout row>
          <v-flex xs12>
            <v-text-field label="Address" v-model="address">
              <template v-slot:append-outer>
                <v-icon @click="findPropertyClick" color="blue">send</v-icon>
                <v-icon
                  v-if="property"
                  @click="findCompsClick"
                  color="green"
                  class="pl-2"
                  >layers</v-icon
                >
              </template>
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid grid-list-lg class="py-0" v-if="property != null">
        <v-card>
          <v-card-text>
            <PropertyDetails :property="property"></PropertyDetails>
          </v-card-text>
        </v-card>
      </v-container>
    </v-content>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { getRequestVariables as propertyRequest } from "../../api/property";
import Toolbar from "../Toolbar";
import PropertyDetails from "../Property/PropertyDetails";

export default {
  name: "Sandbox",
  components: {
    Toolbar,
    PropertyDetails
  },
  data() {
    return {
      address: "3521 N Michigan Ave"
    };
  },
  computed: {
    ...mapState({
      sandboxStore: state => state.sandbox,
      property: state => state.sandbox.item
    })
  },
  methods: {
    ...mapActions({
      findProperty: "sandbox/fetchItem",
      findComps: "sandbox/findComps"
    }),
    findPropertyClick: function() {
      const request = propertyRequest();
      request.term = this.address;

      this.findProperty(request);
    },
    findCompsClick: function() {
      const request = propertyRequest();
      request.term = this.address;

      if (this.property) {
        request.id = parseInt(this.property.id);
      }

      this.findComps(request);
    }
  }
};
</script>

<style scoped></style>
