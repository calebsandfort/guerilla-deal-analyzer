import { apolloClient } from "../../apollo";
import * as propertyApi from "../../api/property";
import _ from "lodash";
import * as utilities from "../../backend/utilities/utilities";

const state = {
  item: null,
  spotlightItem: null,
  comps: [],
  dealComps: [],
  compFilter: utilities.defaultCompFilter(),
  finding: false,
  search_keywords: [
    "remodel",
    "update",
    "hardwood",
    "hard wood",
    "new",
    "granite"
  ],
  arv: 0,
  repairEstimate: utilities.newRepairEstimate(),
  listItems: {
    // prettier-ignore
    amenityCount: [
      { text: "No Filter", value: -1 },
      { text: "0", value: 0 },
      { text: "1", value: 1 },
      { text: "2", value: 2 },
      { text: "3", value: 3 },
      { text: "4", value: 4 },
      { text: "5", value: 5 },
      { text: "6", value: 6 }
    ],
    // prettier-ignore
    percentages: [
      { text: "-30%", value: -.3 },
      { text: "-25%", value: -.25 },
      { text: "-20%", value: -.2 },
      { text: "-15%", value: -.15 },
      { text: "-10%", value: -.1 },
      { text: "-5%", value: -.05 },
      { text: "No Filter", value: -1 },
      { text: "5%", value: .05 },
      { text: "10%", value: .1 },
      { text: "15%", value: .15 },
      { text: "20%", value: .2 },
      { text: "25%", value: .25 },
      { text: "30%", value: .3 }
    ],
    // prettier-ignore
    distances: [
      { text: "No Filter", value: -1 },
      { text: ".5 miles", value: .5 },
      { text: "1 mile", value: 1 },
      { text: "1.5 miles", value: 1.5 },
      { text: "2 miles", value: 2 },
      { text: "2.5 miles", value: 2.5 },
      { text: "3 miles", value: 3 }
    ],
    // prettier-ignore
    years: [
      { text: "No Filter", value: -1 },
      { text: "2018", value: 2018 },
      { text: "2017", value: 2017 },
      { text: "2016", value: 2016 },
      { text: "2015", value: 2015 },
      { text: "2014", value: 2014 },
      { text: "2010", value: 2010 },
      { text: "2005", value: 2005 },
      { text: "2000", value: 2000 },
      { text: "1995", value: 1995 },
      { text: "1990", value: 1990 },
      { text: "1980", value: 1980 },
      { text: "1970", value: 1970 },
      { text: "1960", value: 1960 },
      { text: "1950", value: 1950 },
      { text: "1940", value: 1940 },
      { text: "1920", value: 1920 },
      { text: "1900", value: 1900 }
    ]
  }
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
  setDealComps(state, list) {
    state.dealComps = list;
  },
  setCompFilter(state, compFilter) {
    state.compFilter = Object.assign({}, compFilter);
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

    const property = findProperty.data.findProperty;

    commit("setItem", property);

    if (requestVariables.triggerFindComps) {
      const findCompsRequest = propertyApi.getRequestVariables();
      findCompsRequest.id = parseInt(property.id);
      findCompsRequest.fromAction = true;
      findCompsRequest.coord.latitude = property.latitude;
      findCompsRequest.coord.longitude = property.longitude;
      findCompsRequest.search_keywords = state.search_keywords;
      findCompsRequest.useCompCache = true;

      const compFilter = utilities.defaultCompFilter();
      compFilter.minBeds = property.beds;
      compFilter.maxBeds = property.beds;
      compFilter.minBaths = 1;
      compFilter.minSqft = -0.15;
      compFilter.maxSqft = 0.15;
      commit("setCompFilter", compFilter);

      await dispatch("findComps", findCompsRequest);
    }

    commit("setFinding", false);
  },

  async findComps({ commit, state }, requestVariables) {
    if (!requestVariables.fromAction) {
      commit("setFinding", true);

      if (state.item != null) {
        requestVariables.id = parseInt(state.item.id);
        requestVariables.coord.latitude = state.item.latitude;
        requestVariables.coord.longitude = state.item.longitude;
        requestVariables.search_keywords = state.search_keywords;
      }
    }

    requestVariables.compFilter = state.compFilter;

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
