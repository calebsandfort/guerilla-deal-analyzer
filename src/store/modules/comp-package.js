import { apolloClient } from "../../apollo";
import * as propertyApi from "../../api/property";

const state = {
  list: [],
  finding: false,
  denied: true
};

const getters = {
  count: function(state) {
    return state.list.length;
  }
};

export const mutations = {
  setFinding(state, finding) {
    state.finding = finding;
  },
  setDenied(state, denied) {
    state.denied = denied;
  },
  setList(state, list) {
    state.list = list;
  },

  addItem(state, item) {
    state.list.push(item);
  },

  updateItem(state, updatedItem) {
    state.list = state.list.map(item => {
      if (updatedItem.id === item.id) {
        return Object.assign({}, item, updatedItem);
      }
      return item;
    });

    state.finding = false;
  },

  clearList(state) {
    if (state.list.length > 0) {
      state.list = [];
    }
  }
};

export const actions = {
  async expandoUpdate({ commit }, requestVariables) {
    commit("setFinding", true);
    const response = await propertyApi.expandoUpdate(apolloClient, requestVariables);
    commit("updateItem", response.data.expandoPropertyUpdate);
  },

  async fetchList({ commit }, requestVariables) {
    const response = await propertyApi.getAllQueryable(apolloClient, requestVariables);
    commit("setList", response.data.propertiesQueryable);
  },

  async findProperties({ commit }, requestVariables) {
    const response = await propertyApi.findProperties(apolloClient, requestVariables);
    commit("setList", response.data.findProperties);
  },

  async findPropertiesIncrementally({ commit }, requestVariables) {
    commit("clearList");
    commit("setFinding", true);
    let counter = 0;
    let nullCounter = 0;

    for (let i = 0; i < requestVariables.terms.length; i++) {
      const term = requestVariables.terms[i];
      const variables = Object.assign({}, requestVariables, {
        terms: [],
        term: term,
        status: requestVariables.status,
        tag: requestVariables.tag
      });

      const response = await propertyApi.findProperty(apolloClient, variables);

      if (response.data.findProperty) {
        commit("addItem", response.data.findProperty);
        counter += 1;
      } else {
        nullCounter += 1;
      }

      if (counter > 50) {
        await new Promise(r => setTimeout(r, 1000 * 30));
        counter = 0;
      } else if (nullCounter > 2) {
        commit("setDenied", true);
        break;
      }
    }

    commit("setFinding", false);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
