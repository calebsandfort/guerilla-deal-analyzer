<template>
  <v-toolbar app>
    <v-toolbar-title class="headline text-uppercase toolbarTitle" v-on:click="goHome" style="cursor: pointer">
      <v-btn v-if="showBackButton" v-on:click.stop="goBack" icon class="hidden-xs-only btn_Back">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <span>Columbia Sunset </span>
      <span class="font-weight-light">DEAL TOOLS</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat :to="'/lead-finder'">Lead Finder</v-btn>
      <v-btn flat :to="'/deal-calculator'">Deal Calculator</v-btn>
      <v-btn flat :to="'/deal-wizard'">Deal Wizard</v-btn>
      <v-btn flat :to="'/sandbox'">Sandbox</v-btn>
      <v-btn flat :to="'/research'">Research</v-btn>
      <v-btn flat :to="'/active-projects'">Active Projects</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: "Toolbar",
  props: {
    backPath: {
      type: String,
      default: ""
    }
  },
  computed: {
    showBackButton() {
      return this.backPath !== "";
    }
  },
  methods: {
    goBack() {
      this.$router.push(this.backPath);
    },
    goHome() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped></style>
