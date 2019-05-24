<template>
  <v-container class="px-0 pt-0">
    <Toolbar></Toolbar>
    <v-content>
      <v-container fluid>
        <v-layout text-xs-center wrap>
          <v-flex xs12>
            <v-img :src="require('../assets/guerillaLogo.png')" class="my-3" contain height="175"></v-img>
          </v-flex>
          <v-flex mb-4>
            <h1 class="display-2 font-weight-bold mb-3">
              Let's Make a Deal!
            </h1>
            <p class="subheading font-weight-regular">
              Various tools for anaylzing real estate investement leads.
            </p>
          </v-flex>
          <v-flex mb-5 xs12>
            <h2 class="headline font-weight-bold mb-3">Sections</h2>
            <v-layout justify-center>
              <router-link :to="'/comp-assistant'" class="subheading mx-3">Comp Assistant</router-link>
              <router-link :to="'/lead-finder'" class="subheading mx-3">Lead Finder</router-link>
              <router-link :to="'/deal-calculator-finder'" class="subheading mx-3">Deal Calculator</router-link>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-container>
</template>

<script>
import Toolbar from "./Toolbar";

export default {
  name: "LandingPage",
  components: {
    Toolbar
  },
  beforeCreate() {
    //this.$store.dispatch("team/fetchList");
    // this.$store.dispatch("season/fetchList");
  },
  mounted() {
    //this.$store.commit("ui/setShowBackButton", false);
  },
  data: function() {
    return {
      technologyStack: [
        {
          name: "ApexCharts",
          logo: "apexcharts.png",
          url: "https://apexcharts.com/"
        },
        {
          name: "Apollo",
          logo: "apollo.png",
          url: "https://www.apollographql.com/"
        },
        {
          name: "AWS",
          logo: "aws.png",
          url: "https://aws.amazon.com/"
        },
        {
          name: "Chai",
          logo: "chai.png",
          url: "https://www.chaijs.com/"
        },
        {
          name: "GraphQL",
          logo: "graphql.svg",
          url: "https://graphql.org/"
        },
        {
          name: "Mocha",
          logo: "mocha.png",
          url: "https://mochajs.org/"
        },
        {
          name: "PostgreSQL",
          logo: "postgresql.png",
          url: "https://www.postgresql.org/"
        },
        {
          name: "Ubuntu",
          logo: "ubuntu.png",
          url: "https://www.ubuntu.com/"
        },
        {
          name: "Vue.js",
          logo: "vue.png",
          url: "https://vuejs.org/"
        },
        {
          name: "Vue Router",
          logo: "vue-router.png",
          url: "https://router.vuejs.org/"
        },
        {
          name: "Vuetify",
          logo: "vuetify.png",
          url: "https://vuetifyjs.com/en/"
        },
        {
          name: "Vuex",
          logo: "vuex.png",
          url: "https://vuex.vuejs.org/"
        }
      ]
    };
  }
};
</script>

<style scoped></style>
