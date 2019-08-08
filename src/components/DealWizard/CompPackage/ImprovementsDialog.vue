<template>
  <div class="d-inline-block">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-icon title="Improvements" class="pr-2" style="cursor: pointer;" color="green darken-2" v-on="on">settings_ethernet</v-icon>
      </template>
      <v-card>
        <v-card-title class="headline primary py-3 white--text">
          Improvements
        </v-card-title>

        <v-card-text>
          <v-data-table :headers="headers" :pagination.sync="pagination" :disable-initial-sort="true" :items="property.improvements" item-key="key">
            <template v-slot:items="props">
              <tr :key="props.item.key">
                <td>
                  {{ props.item.segmentType }}
                </td>
                <td class="text-xs-left">
                  {{ formatNumber(props.item.sqft, { precision: 0 }) }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" dark text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import formatNumber from "accounting-js/lib/formatNumber";

export default {
  name: "ImprovementsDialog",
  components: {},
  props: {},
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: "DESCRIPTION",
          align: "left",
          sortable: false,
          value: "segmentType"
        },
        {
          text: "SQFT",
          align: "left",
          sortable: false,
          value: "sqft"
        }
      ],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  computed: {
    ...mapState({
      property: state => state.dealWizard.item
    })
    // example: function() {return {}}
  },
  watch: {
    // comps: function () {}
  },
  methods: {
    formatNumber
  }
};
</script>

<style scoped></style>
