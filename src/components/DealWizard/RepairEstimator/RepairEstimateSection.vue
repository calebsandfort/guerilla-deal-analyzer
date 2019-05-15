<template>
  <div>
    <v-expansion-panel>
      <template
        v-for="repairEstimateSubSection in repairEstimateSection.subSections"
      >
        <v-expansion-panel-content :key="repairEstimateSubSection.key">
          <template v-slot:header>
            <v-container fluid grid-list-xs class="pa-0">
              <v-layout
                row
                :class="[
                  repairEstimateSubSection.selected ? 'font-weight-bold' : ''
                ]"
              >
                <v-flex grow pa-1 align-self-center>
                  {{ repairEstimateSubSection.title }}
                </v-flex>
                <v-flex shrink pa-1 pr-3 align-self-center>
                  {{
                    formatMoney(repairEstimateSubSection.totalCost, {
                      precision: 2
                    })
                  }}
                </v-flex>
              </v-layout>
            </v-container>
          </template>
          <v-card>
            <v-card-text class="pt-0">
              <RepairEstimateSubSection
                :line-items="repairEstimateSubSection.lineItems"
              ></RepairEstimateSubSection>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </template>
    </v-expansion-panel>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import * as repairEstimateSectionTypes from "../../../backend/enums/repairEstimateSectionTypes";
import formatMoney from "accounting-js/lib/formatMoney";
import RepairEstimateSubSection from "./RepairEstimateSubSection";

export default {
  name: "RepairEstimateSection",
  components: {
    RepairEstimateSubSection
  },
  props: {
    sectionType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      repairEstimateSectionTypes
    };
  },
  computed: {
    ...mapState({
      dealWizardStore: state => state.dealWizard,
      repairEstimate: state => state.dealWizard.repairEstimate
    }),
    repairEstimateSection() {
      const that = this;
      return _.find(that.repairEstimate.sections, function(x) {
        return x.sectionType == that.sectionType;
      });
    }
  },
  methods: {
    formatMoney: formatMoney
  }
};
</script>

<style scoped></style>
