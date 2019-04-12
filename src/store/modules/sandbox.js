import { apolloClient } from "../../apollo";
import * as propertyApi from "../../api/property";

const state = {
  item: null,
  comps: [],
  finding: false
};

const getters = {};

export const mutations = {
  setFinding(state, finding) {
    state.finding = finding;
  },
  setItem(state, item) {
    state.item = Object.assign({}, item);
    state.finding = false;
  },
  setComps(state, list) {
    state.comps = list;
    state.finding = false;
  }
};

export const actions = {
  async fetchItem({ commit }, requestVariables) {
    commit("setFinding", true);

    const response = await propertyApi.findProperty(
      apolloClient,
      requestVariables
    );
    commit("setItem", response.data.findProperty);
  },

  async findComps({ commit }, requestVariables) {
    commit("setFinding", true);

    const response = await propertyApi.findComps(
      apolloClient,
      requestVariables
    );
    commit("setComps", response.data.findComps);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
