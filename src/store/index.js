import Vue from "vue";
import Vuex from "vuex";
import leadFinder from "./modules/lead-finder";
import dealWizard from "./modules/deal-wizard";
import compPackage from "./modules/comp-package";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    leadFinder,
    dealWizard,
    compPackage
  },
  strict: debug
});
