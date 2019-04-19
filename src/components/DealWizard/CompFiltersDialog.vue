<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn flat icon color="primary" v-on="on">
        <v-icon>filter_list</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Comp Filters</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md> </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "CompFiltersDialog",
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    ...mapState({
      dealWizardStore: state => state.dealWizard
    })
  },
  methods: {
    ...mapMutations({
      setSpotlightComp: "dealWizard/setSpotlightItem"
    }),
    ...mapActions({
      setField: "dealWizard/setField"
    })
  }
};
</script>

<style scoped></style>
