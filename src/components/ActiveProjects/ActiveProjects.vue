<template>
  <v-container fluid class="px-0 pt-0">
    <Toolbar back-path="/"></Toolbar>
    <v-content>
      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs4>
            <v-card>
              <v-toolbar card color="pink" dark dense>
                <v-toolbar-title>Snapshot</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="pa-2">
                <v-data-table
                  :headers="headers"
                  :pagination.sync="pagination"
                  :hide-actions="true"
                  :disable-initial-sort="true"
                  :items="projects"
                  item-key="title"
                  class="condensed-table elevation-1"
                >
                  <template slot="headers" slot-scope="props">
                    <tr class="blue" style="height: 40px;">
                      <th style="font-size: 13px;" v-for="(header, index) in props.headers" :key="`header_${index}`" :class="['white--text', 'text-xs-left']">
                        {{ header.text }}
                      </th>
                    </tr>
                  </template>
                  <template v-slot:items="props">
                    <tr :key="props.item.title">
                      <td>
                        {{ props.item.title }}
                      </td>
                      <td>
                        <a :href="props.item.expenseReportUrl" target="_blank">Report</a>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";
import Toolbar from "../Toolbar";

export default {
  name: "ActiveProjects",
  components: {
    Toolbar
  },
  props: {},
  data() {
    return {
      headers: [
        {
          text: "Title",
          align: "left",
          sortable: false,
          value: "title"
        },
        {
          text: "Overall Expense Report",
          align: "left",
          sortable: false,
          value: "expenseReportUrl"
        }
      ],
      pagination: {
        rowsPerPage: -1
      }
    };
  },
  computed: {
    ...mapState({
      projects: state => state.activeProjects.projects
    })
    // example: function() {return {}}
  },
  watch: {
    // comps: function () {}
  },
  methods: {
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
