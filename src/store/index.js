import Vue from "vue";
import Vuex from "vuex";
import leadFinder from "./modules/lead-finder";
import dealWizard from "./modules/deal-wizard";
import sandbox from "./modules/sandbox";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    leadFinder,
    dealWizard,
    sandbox
  },
  strict: debug
});
