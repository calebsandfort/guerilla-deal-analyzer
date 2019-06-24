<template>
  <v-container fluid grid-list-lg>
    <v-layout row>
      <v-flex xs12>
        <v-card
          :style="{
            'max-height': `${logHeight}px`,
            overflow: 'auto'
          }"
        >
          <v-list two-line>
            <template v-for="(item, index) in compLog">
              <v-divider v-if="index != 0" :key="`divider_${item.key}`"></v-divider>
              <v-list-tile :key="`tile_${item.key}`">
                <v-list-tile-content>
                  <v-list-tile-title
                    v-html="item.title"
                    v-bind:style="{
                      color: item.color
                    }"
                  ></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.subTitle"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
export default {
  name: "CompLog",
  data() {
    return {
      logHeight: 500
    };
  },
  computed: {
    ...mapState({
      compLog: state => state.dealWizard.compLog
    })
  },
  mounted() {
    const that = this;
    that.logHeight = window.$(window).height() - 300;

    window.$(window).resize(
      _.debounce(function(args) {
        that.logHeight = window.$(window).height() - 300;
      })
    );
  }
};
</script>

<style scoped></style>
