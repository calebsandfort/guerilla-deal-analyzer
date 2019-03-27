import Vue from "vue";
import Vuex from "vuex";
import leadFinder from "./modules/lead-finder";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    leadFinder
  },
  strict: debug
});
