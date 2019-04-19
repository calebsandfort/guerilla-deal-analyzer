import { apolloClient } from "../../apollo";
import * as propertyApi from "../../api/property";
import _ from "lodash";

const state = {
  item: null,
  spotlightItem: null,
  comps: [],
  finding: false,
  search_keywords: [
    "remodel",
    "update",
    "hardwood",
    "hard wood",
    "new",
    "granite"
  ],
  arv: 0
};

const getters = {};

export const mutations = {
  setFinding(state, finding) {
    state.finding = finding;
  },
  setItem(state, item) {
    state.item = item;
  },
  setSpotlightItem(state, id) {
    state.spotlightItem = Object.assign(
      {},
      _.find(state.comps, function(c) {
        return c.id == id;
      })
    );
  },
  setComps(state, list) {
    state.comps = list;
  },
  setField(state, payload) {
    state[payload.name] = payload.v;
  }
};

export const actions = {
  async fetchItem({ dispatch, commit, state }, requestVariables) {
    commit("setFinding", true);
    const response = await propertyApi.get(apolloClient, requestVariables);
    commit("setItem", response.data.property);
  },

  async findItem({ dispatch, commit, state }, requestVariables) {
    commit("setFinding", true);
    const findProperty = await propertyApi.findProperty(
      apolloClient,
      requestVariables
    );
    commit("setItem", findProperty.data.findProperty);

    if (requestVariables.triggerFindComps) {
      const findCompsRequest = propertyApi.getRequestVariables();
      findCompsRequest.id = parseInt(findProperty.data.findProperty.id);
      findCompsRequest.fromAction = true;
      findCompsRequest.coord.latitude = findProperty.data.findProperty.latitude;
      findCompsRequest.coord.longitude =
        findProperty.data.findProperty.longitude;
      findCompsRequest.search_keywords = state.search_keywords;
      await dispatch("findComps", findCompsRequest);
    }

    commit("setFinding", false);
  },

  async findComps({ commit }, requestVariables) {
    if (!requestVariables.fromAction) {
      commit("setFinding", true);
    }

    const response = await propertyApi.findComps(
      apolloClient,
      requestVariables
    );
    commit("setComps", response.data.findComps);

    if (!requestVariables.fromAction) {
      commit("setFinding", false);
    }
  },
  setField({ commit }, payload) {
    commit("setField", payload);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
