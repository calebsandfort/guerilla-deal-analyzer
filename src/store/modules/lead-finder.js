import { apolloClient } from "../../apollo";
import * as propertyApi from "../../api/property";

const state = {
  list: []
};

const getters = {
  count: function(state) {
    return state.list.length;
  }
};

export const mutations = {
  setList(state, list) {
    state.list = list;
  },

  addItem(state, item) {
    state.list.push(item);
  },

  clearList(state) {
    if (state.list.length > 0) {
      state.list = [];
    }
  }
};

export const actions = {
  async fetchList({ commit }, requestVariables) {
    const response = await propertyApi.getAll(apolloClient, requestVariables);
    commit("setList", response.data.properties);
  },

  async findProperties({ commit }, requestVariables) {
    const response = await propertyApi.findProperties(
      apolloClient,
      requestVariables
    );
    commit("setList", response.data.findProperties);
  },

  async findPropertiesIncrementally({ commit }, requestVariables) {
    commit("clearList");
    for (let i = 0; i < requestVariables.terms.length; i++) {
      const term = requestVariables.terms[i];
      const variables = Object.assign({}, requestVariables, {
        terms: [],
        term: term
      });

      const response = await propertyApi.findProperty(apolloClient, variables);

      if (response.data.findProperty) {
        commit("addItem", response.data.findProperty);
      }
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
