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
    state.item = item;
  },
  setComps(state, list) {
    state.comps = list;
  }
};

export const actions = {
  async fetchItem({ dispatch, commit, state }, requestVariables) {
    commit("setFinding", true);
    const response = await propertyApi.get(apolloClient, requestVariables);
    commit("setItem", response.data.property);
  },

  async findItem(
    { dispatch, commit, state },
    requestVariables,
    triggerFindComps = true
  ) {
    commit("setFinding", true);
    const findProperty = await propertyApi.findProperty(
      apolloClient,
      requestVariables
    );
    commit("setItem", findProperty.data.findProperty);

    if (triggerFindComps) {
      const findCompsRequest = propertyApi.getRequestVariables();
      findCompsRequest.id = parseInt(findProperty.data.findProperty.id);
      await dispatch("findComps", findCompsRequest, true);
    }

    commit("setFinding", false);
  },

  async findComps({ commit }, requestVariables, fromAction = false) {
    if (!fromAction) {
      commit("setFinding", true);
    }

    const response = await propertyApi.findComps(
      apolloClient,
      requestVariables
    );
    commit("setComps", response.data.findComps);

    if (!fromAction) {
      commit("setFinding", false);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
