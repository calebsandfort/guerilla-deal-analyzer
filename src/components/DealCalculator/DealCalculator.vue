<template>
  <v-container fluid class="px-0 pt-0">
    <Toolbar back-path="/"></Toolbar>
    <v-content>
      <v-container fluid>
        <v-card>
          <v-toolbar card color="pink" dark dense>
            <v-toolbar-title>Snapshot</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-2">
            <v-form>
              <v-layout row wrap>
                <v-flex xs12 sm6 md3 class="px-2">
                  <v-text-field
                    name="purchasePrice"
                    label="Purchase Price"
                    prefix="$"
                    v-model.number="purchasePrice"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md3 class="px-2">
                  <v-text-field
                    name="rehabBudget"
                    label="Rehab Budget"
                    prefix="$"
                    v-model.number="rehabBudget"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md3 class="px-2">
                  <v-text-field
                    name="arv"
                    label="ARV"
                    prefix="$"
                    v-model.number="arv"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md3 class="px-2">
                  <v-text-field
                    name="roi"
                    label="ROI"
                    suffix="%"
                    v-model.number="roi"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-expansion-panel expand>
                <v-expansion-panel-content>
                  <template v-slot:header
                    ><h3>Holding Costs</h3>
                  </template>
                  <v-card>
                    <v-card-text>
                      <v-layout row wrap>
                        <v-flex
                          xs12
                          sm4
                          md6
                          align-self-center
                          class="pr-2 pl-4"
                        >
                          <h4>
                            Property Taxes
                          </h4>
                        </v-flex>
                        <v-flex xs12 sm4 md3 class="px-2">
                          <v-text-field
                            name="holdingCosts.propertyTaxesAnnually"
                            label="Annually"
                            prefix="$"
                            v-model.number="holdingCosts.propertyTaxesAnnually"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm4 md3 class="px-2">
                          <v-text-field
                            name="holdingCosts.propertyTaxesMonthly"
                            label="Monthly"
                            prefix="$"
                            readonly
                            v-model.number="holdingCosts.propertyTaxesMonthly"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex
                          xs12
                          sm4
                          md6
                          align-self-center
                          class="pr-2 pl-4"
                        >
                          <h4>
                            Insurance Costs
                          </h4>
                        </v-flex>
                        <v-flex xs12 sm4 md3 class="px-2">
                          <v-text-field
                            name="holdingCosts.insuranceAnnually"
                            label="Annually"
                            prefix="$"
                            v-model.number="holdingCosts.insuranceAnnually"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm4 md3 class="px-2">
                          <v-text-field
                            name="holdingCosts.insuranceMonthly"
                            label="Monthly"
                            prefix="$"
                            readonly
                            v-model.number="holdingCosts.insuranceMonthly"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout row wrap>
                        <v-flex
                          xs12
                          sm4
                          md6
                          align-self-center
                          class="pr-2 pl-4"
                        >
                          <h4>
                            HOA Fees
                          </h4>
                        </v-flex>
                        <v-flex xs12 sm4 md3 class="px-2">
                          <v-text-field
                            name="holdingCosts.hoaAnnually"
                            label="Annually"
                            prefix="$"
                            v-model.number="holdingCosts.hoaAnnually"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm4 md3 class="px-2">
                          <v-text-field
                            name="holdingCosts.hoaMonthly"
                            label="Monthly"
                            prefix="$"
                            readonly
                            v-model.number="holdingCosts.hoaMonthly"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                  <template v-slot:header
                    ><h3>Financing Costs</h3></template
                  >
                  <v-card>
                    <v-card-text>Financing Costs</v-card-text>
                  </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                  <template v-slot:header
                    ><h3>Buying Transaction Costs</h3></template
                  >
                  <v-card>
                    <v-card-text>Buying Transaction Costs</v-card-text>
                  </v-card>
                </v-expansion-panel-content>
                <v-expansion-panel-content>
                  <template v-slot:header
                    ><h3>Selling Transaction Costs</h3></template
                  >
                  <v-card>
                    <v-card-text>Holding Costs</v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-content>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Toolbar from "../Toolbar";

export default {
  name: "DealCalculator",
  components: {
    Toolbar
  },
  data() {
    return {
      purchasePrice: 225000,
      rehabBudget: 60000,
      arv: 400000,
      roi: 15,
      holdingCosts: {
        propertyTaxesAnnually: 3600,
        propertyTaxesMonthly: 300,
        insuranceAnnually: 1200,
        insuranceMonthly: 100,
        hoaAnnually: 1200,
        hoaMonthly: 100,
        utilitiesMonthly: 200
      }
    };
  },
  watch: {
    "holdingCosts.propertyTaxesAnnually": function(newVal, oldVal) {
      this.holdingCosts.propertyTaxesMonthly = (newVal / 12).toFixed(0);
    },
    "holdingCosts.insuranceAnnually": function(newVal, oldVal) {
      this.holdingCosts.insuranceMonthly = (newVal / 12).toFixed(0);
    },
    "holdingCosts.hoaAnnually": function(newVal, oldVal) {
      this.holdingCosts.hoaMonthly = (newVal / 12).toFixed(0);
    }
  },
  computed: {
    ...mapState({
      //leadFinderStore: state => state.leadFinder
    })
  },
  methods: {
    ...mapActions({
      //fetchTeam: 'team/fetchItem'
    })
  }
};
</script>

<style scoped></style>
