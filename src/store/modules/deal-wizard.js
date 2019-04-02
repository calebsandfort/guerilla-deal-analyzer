import { apolloClient } from "../../apollo";
import * as propertyApi from "../../api/property";

const state = {
  item: {
    streetPlusZip: "blah"
  }
};

const getters = {};

export const mutations = {
  setItem(state, item) {
    state.item = item;
  }
};

export const actions = {
  async fetchItem({ dispatch, commit, state }, requestVariables) {
    const response = await propertyApi.get(apolloClient, requestVariables);
    commit("setItem", response.data.property);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
