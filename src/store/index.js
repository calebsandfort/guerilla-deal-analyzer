import Vue from "vue";
import Vuex from "vuex";
import leadFinder from "./modules/lead-finder";
import dealWizard from "./modules/deal-wizard";
import compPackage from "./modules/comp-package";
import sandbox from "./modules/sandbox";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    leadFinder,
    dealWizard,
    compPackage,
    sandbox
  },
  strict: debug
});
