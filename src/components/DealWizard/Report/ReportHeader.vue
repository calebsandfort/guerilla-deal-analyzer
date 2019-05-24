<template>
  <div>
    <v-layout row>
      <v-flex grow align-self-end class="pt-0 pb-1">
        <h5 class="headline font-weight-medium blue-grey--text text--darken-2">{{ header }}</h5>
      </v-flex>
      <v-flex shrink align-self-center style="min-width: 82px;" class="pt-0">
        <div>
          <v-img :src="require('../../../assets/cspLogos/logo.png')" contain height="30" width="48"></v-img>
        </div>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 class="pt-0">
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "ReportHeader",
  components: {},
  props: {
    header: {
      type: String
    }
  },
  data() {
    return {};
  },
  computed: {
    // ...mapState({
    //   example: state => state.example,
    // }),
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
