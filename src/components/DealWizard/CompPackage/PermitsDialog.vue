<template>
  <div class="d-inline-block">
    <v-dialog v-model="dialog" width="800">
      <template v-slot:activator="{ on }">
        <v-icon title="Permits" class="pr-2" style="cursor: pointer;" color="blue darken-2" v-on="on">format_list_bulleted</v-icon>
      </template>
      <v-card>
        <v-card-title class="headline primary py-3 white--text">
          Permits
        </v-card-title>

        <v-card-text>
          <v-data-table :headers="headers" :pagination.sync="pagination" :disable-initial-sort="true" :items="property.permits" item-key="key">
            <template v-slot:items="props">
              <tr :key="props.item.key">
                <td>
                  <a :href="`https:${props.item.application.href}`" target="_blank">{{ props.item.application.number }}</a>
                </td>
                <td class="text-xs-left" v-html="props.item.permitType"></td>
                <td class="text-xs-left">
                  {{ props.item.updated }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue" dark text :href="property.portlandmaps_url" target="_blank">
            Portland Maps
            <v-icon right dark>open_in_new</v-icon>
          </v-btn>
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
  name: "PermitsDialog",
  components: {},
  props: {},
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: "APPLICATION",
          align: "left",
          sortable: false,
          value: "application.number"
        },
        {
          text: "PERMIT TYPE",
          align: "left",
          sortable: false,
          value: "permitType"
        },
        {
          text: "UPDATED",
          align: "left",
          sortable: false,
          value: "updated"
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
