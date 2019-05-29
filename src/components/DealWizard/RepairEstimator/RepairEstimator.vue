<template>
  <v-container fluid grid-list-lg class="pa-3">
    <v-layout row>
      <v-flex xs9 row v-show="!repairEstimate.quick">
        <v-layout>
          <v-flex xs12>
            <v-stepper non-linear>
              <v-stepper-header>
                <template v-for="(repairEstimateSection, idx) in repairEstimate.sections">
                  <v-stepper-step :key="`${idx}-step`" :step="repairEstimateSection.sectionType" editable>
                    {{ repairEstimateSectionTypes.getDisplayForValue(repairEstimateSection.sectionType) }}
                  </v-stepper-step>
                  <v-divider :key="`${idx}-divider`" v-if="idx < repairEstimate.sections.length - 1"></v-divider>
                </template>
              </v-stepper-header>
              <v-stepper-items
                :style="{
                  'max-height': `${stepperHeight}px`,
                  overflow: 'auto'
                }"
              >
                <template v-for="(repairEstimateSection, idx) in repairEstimate.sections">
                  <v-stepper-content :key="`${idx}-step-content`" :step="repairEstimateSection.sectionType" editable class="pa-2">
                    <RepairEstimateSection :section-type="repairEstimateSection.sectionType"></RepairEstimateSection>
                  </v-stepper-content>
                </template>
              </v-stepper-items>
            </v-stepper>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex :xs3="!repairEstimate.quick" :xs12="repairEstimate.quick">
        <v-layout row>
          <v-flex shrink align-self-center>
            Quick Estimate
          </v-flex>
          <v-flex shrink>
            <v-switch v-model="quick" class="pl-4"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              name="repairEstimate.title"
              label="Title"
              :value="repairEstimate.title"
              v-on:keyup="fieldChangedText"
              class="hide-text-field-details"
            ></v-text-field>
          </v-flex>
          <template v-for="(repairEstimateSection, idx) in repairEstimate.sections">
            <v-flex :key="`${idx}-side-display`" xs12 v-show="!repairEstimate.quick">
              <VuetifyNumeric
                :label="repairEstimateSectionTypes.getDisplayForValue(repairEstimateSection.sectionType)"
                css-class="hide-text-field-details"
                currency="$"
                :precision="2"
                :readonly="true"
                :value="repairEstimateSection.totalCost"
              >
              </VuetifyNumeric>
            </v-flex>
          </template>
          <v-flex xs12>
            <VuetifyNumeric
              field="repairEstimate.totalCost,dealAnalysis.DF_RepairCosts"
              label="Total"
              css-class="hide-text-field-details"
              currency="$"
              :precision="2"
              :outline="true"
              :success="true"
              :readonly="!repairEstimate.quick"
              :value="repairEstimate.totalCost"
              v-on:input="fieldChangedNumber"
            >
            </VuetifyNumeric>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-dialog :value="addRepairEstimateLineItemSubSectionKey != ''" max-width="500px" :persistent="true">
      <v-card>
        <v-card-title>
          <span class="headline">Add Item</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="addItem.name" label="Repair Type" class="hide-text-field-details small-text-field"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <VuetifyNumeric
                  field="quantity"
                  label="# Units"
                  css-class="hide-text-field-details small-text-field"
                  :precision="2"
                  :value="addItem.quantity"
                  v-on:input="itemFieldChanged"
                >
                </VuetifyNumeric>
              </v-flex>
              <v-flex xs12>
                <VuetifyNumeric
                  field="unitCost"
                  label="Unit Cost"
                  css-class="hide-text-field-details small-text-field"
                  :precision="2"
                  currency="$"
                  :value="addItem.unitCost"
                  v-on:input="itemFieldChanged"
                >
                </VuetifyNumeric>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" class="white--text" @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" class="white--text" @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import * as utilities from "../../../backend/utilities/utilities";
import VuetifyNumeric from "../../Shared/VuetifyNumeric";
import * as repairEstimateSectionTypes from "../../../backend/enums/repairEstimateSectionTypes";
import RepairEstimateSection from "./RepairEstimateSection";
import uuidv4 from "uuid/v4";
import * as unitTypes from "../../../backend/enums/unitTypes";

export default {
  name: "RepairEstimator",
  components: {
    VuetifyNumeric,
    RepairEstimateSection
  },
  mounted() {
    const that = this;
    that.stepperHeight = window.$(window).height() - 250;

    window.$(window).resize(
      _.debounce(function(args) {
        that.stepperHeight = window.$(window).height() - 250;
      })
    );
  },
  data() {
    return {
      repairEstimateSectionTypes,
      stepperHeight: 400,
      quick: true,
      addItem: this.defaultItem()
    };
  },
  computed: {
    ...mapState({
      dealWizardStore: state => state.dealWizard,
      repairEstimate: state => state.dealWizard.repairEstimate,
      addRepairEstimateLineItemSubSectionKey: state => state.dealWizard.addRepairEstimateLineItemSubSectionKey
    })
  },
  watch: {
    "repairEstimate.quick": function() {
      this.quick = this.repairEstimate.quick;
    },
    quick: function() {
      this.setField({
        name: "repairEstimate.quick",
        v: this.quick
      });
    }
  },
  methods: {
    ...mapMutations({
      addRepairEstimateLineItem: "dealWizard/addRepairEstimateLineItem"
      // setSpotlightComp: "dealWizard/setSpotlightItem",
      // setDealComps: "dealWizard/setDealComps"
    }),

    ...mapActions({
      setField: "dealWizard/setField"
      // findComps: "dealWizard/findComps"
    }),

    quickToggle: function(e) {
      console.log(e != null);

      this.setField({
        name: "repairEstimate.quick",
        v: e != null
      });
    },

    fieldChangedText: _.debounce(function(event) {
      this.setField({
        name: event.target.name,
        v: event.target.value
      });
    }, 250),

    fieldChangedNumber: _.debounce(function(args) {
      this.setField({
        name: args.field,
        v: args.value
      });
    }, 1000),

    defaultItem() {
      return {
        key: uuidv4(),
        selected: true,
        name: "Other",
        quantity: 1,
        unit: unitTypes.unitTypes.LUMP_SUM.value,
        unitCost: 0,
        totalCost: 0
      };
    },

    itemFieldChanged: _.debounce(function(args) {
      this.addItem[args.field] = args.value;
    }, 1000),

    close() {
      this.setField({
        name: "addRepairEstimateLineItemSubSectionKey",
        v: ""
      });
    },

    save() {
      this.addRepairEstimateLineItem(Object.assign({}, this.addItem));
      this.close();
    }
  }
};
</script>

<style scoped></style>
