import { apolloClient } from "../../apollo";
import * as propertyApi from "../../api/property";
import _ from "lodash";
import * as utilities from "../../backend/utilities/utilities";
import * as statuses from "../../backend/enums/statuses";
import colors from "vuetify/es5/util/colors";
import uuidv4 from "uuid/v4";

const state = {
  item: null,
  spotlightItem: null,
  comps: [],
  dealComps: [],
  compFilter: utilities.defaultCompFilter(),
  finding: false,
  findingComps: false,
  pullingCompsFromCache: false,
  compLog: [],
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
  setFindingComps(state, findingComps) {
    state.findingComps = findingComps;
  },
  setPullingCompsFromCache(state, pullingCompsFromCache) {
    state.pullingCompsFromCache = pullingCompsFromCache;
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
  pushComp(state, comp) {
    state.comps.push(Object.assign({}, comp));
  },
  setDealComps(state, list) {
    state.dealComps = list;
  },
  setCompFilter(state, compFilter) {
    state.compFilter = Object.assign({}, compFilter);
  },
  setField(state, payload) {
    _.set(state, payload.name, payload.v);
  },
  addCompLogMessage(state, payload) {
    state.compLog = [payload, ...state.compLog];
  },
  clearCompLog(state) {
    state.compLog = [];
  },
  setRepairEstimateSqft(state) {
    const re = utilities.newRepairEstimate();
    utilities.setRepairEstimateSqft(re, state.item.sqft);
    state.repairEstimate = re;
  },
  updateRepairEstimateLineItem(state, payload) {
    const temp = Object.assign({}, state.repairEstimate);
    utilities.updateRepairEstimateLineItem(
      temp,
      payload.key,
      payload.field,
      payload.val
    );

    state.repairEstimate = temp;
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

      // prettier-ignore
      compFilter.minSqft = parseInt((property.sqft - (property.sqft * 0.15)).toFixed(0));

      // prettier-ignore
      compFilter.maxSqft = parseInt((property.sqft + (property.sqft * 0.15)).toFixed(0));

      commit("setCompFilter", compFilter);

      await dispatch("findCompsV2", findCompsRequest);
    }

    commit("setFinding", false);
  },

  async findProperty({ dispatch, commit, state }, requestVariables) {
    commit("setFinding", true);
    const findProperty = await propertyApi.findProperty(
      apolloClient,
      requestVariables
    );

    const property = findProperty.data.findProperty;

    commit("setItem", property);
    commit("setRepairEstimateSqft");
    commit("setFinding", false);

    if (requestVariables.triggerFindComps) {
      const compFilter = utilities.defaultCompFilter();
      compFilter.minBeds = property.beds;
      compFilter.maxBeds = property.beds;
      compFilter.minBaths = 1;

      // prettier-ignore
      compFilter.minSqft = parseInt((property.sqft - (property.sqft * 0.15)).toFixed(0));

      // prettier-ignore
      compFilter.maxSqft = parseInt((property.sqft + (property.sqft * 0.15)).toFixed(0));

      commit("setCompFilter", compFilter);

      const findCompsRequest = propertyApi.getRequestVariables();
      findCompsRequest.useCompCache = true;

      await dispatch("findCompsV2", findCompsRequest);
    }
  },

  async findCompsV2({ dispatch, commit, state }, findCompsRequest) {
    if (findCompsRequest.useCompCache && state.item.compCacheArray.length > 0) {
      commit("setPullingCompsFromCache", true);
      if (state.item.compFilterJson) {
        commit("setCompFilter", JSON.parse(state.item.compFilterJson));
      }

      const compCacheRequest = propertyApi.getRequestVariables();
      compCacheRequest.terms = state.item.compCacheArray;
      compCacheRequest.search_keywords = state.search_keywords;
      compCacheRequest.coord.latitude = state.item.latitude;
      compCacheRequest.coord.longitude = state.item.longitude;

      const response = await propertyApi.findProperties(
        apolloClient,
        compCacheRequest
      );

      commit("setComps", response.data.findProperties);
      commit("setPullingCompsFromCache", false);
    } else {
      commit("setFindingComps", true);

      commit("addCompLogMessage", {
        key: uuidv4(),
        color: colors.indigo.accent4,
        title: "Initiating comp search",
        subTitle: "Contacting Zillow..."
      });

      //region Zillow
      // const zillowHtml = window.$(window.$(zillowIframe[0]).attr("srcdoc"));
      //$($(zillowIframe[0]).attr("srcdoc")).find(".list-card-addr").length
      //$($(zillowIframe[0]).attr("srcdoc")).find(".zsg-pagination-next").length

      let currentPage = 1;
      let hasMorePages = true;
      let compAddresses = [];

      const body = window.$("body");

      while (hasMorePages) {
        commit("addCompLogMessage", {
          key: uuidv4(),
          color: colors.indigo.accent4,
          title: "Retrieving comp addresses from Zillow",
          subTitle: `Page ${currentPage}...`
        });

        let compUrl = utilities.buildZillowCompUrl(
          state.item,
          state.compFilter,
          currentPage
        );

        const zillowIframe = window.$(
          "<iframe id='zillowIframe' is='x-frame-bypass'></iframe>"
        );

        zillowIframe.attr("src", compUrl);

        body.append(zillowIframe);

        await utilities.pause(45);

        // const zillowHtml = window.$(window.$(zillowIframe[0]).attr("srcdoc"));
        zillowIframe.remove();

        let results = window
          .$(window.$(zillowIframe[0]).attr("srcdoc"))
          .find(".zsg-photo-card-address");

        if (results.length == 0) {
          results = window
            .$(window.$(zillowIframe[0]).attr("srcdoc"))
            .find(".list-card-addr");
        }

        compAddresses = _.concat(
          compAddresses,
          _.map(results, function(item) {
            return window.$(item).html();
          })
        );

        const nextPage = window
          .$(window.$(zillowIframe[0]).attr("srcdoc"))
          .find(".zsg-pagination-next");
        if (nextPage.length > 0) {
          currentPage += 1;
        } else {
          hasMorePages = false;
        }
      }

      commit("addCompLogMessage", {
        key: uuidv4(),
        color: colors.indigo.accent4,
        title: "Completed Zillow comp search",
        subTitle: `Found ${compAddresses.length} comps`
      });
      //endregion

      //region Redfin Iframe comp work
      // let currentPage = 1;
      // let hasMorePages = true;
      // let compAddresses = [];
      //
      // const body = window.$("body");
      //
      // while (hasMorePages) {
      //   commit("addCompLogMessage", {
      //     key: uuidv4(),
      //     color: colors.pink.accent4,
      //     title: "Retrieving comp addresses from Redfin",
      //     subTitle: `Page ${currentPage}...`
      //   });
      //
      //   let compUrl = utilities.buildRedfinCompUrl(
      //     state.item,
      //     state.compFilter,
      //     currentPage
      //   );
      //
      //   const redfinIframe = window.$(
      //     "<iframe id='redfinIframe' is='x-frame-bypass'></iframe>"
      //   );
      //
      //   redfinIframe.attr("src", compUrl);
      //
      //   body.append(redfinIframe);
      //
      //   await utilities.pause(15);
      //
      //   const redfinHtml = window.$(redfinIframe.attr("srcdoc"));
      //   redfinIframe.remove();
      //
      //   const results = redfinHtml.find(
      //     ".HomeViews .HomeCardContainer > .HomeCard > .v2 > a"
      //   );
      //   compAddresses = _.concat(
      //     compAddresses,
      //     _.map(results, function(item) {
      //       return window.$(item).attr("title");
      //     })
      //   );
      //
      //   const nextPage = redfinHtml.find(
      //     ".PagingControls button:not(.disabled) .slide-next"
      //   );
      //   if (nextPage.length > 0) {
      //     currentPage += 1;
      //   } else {
      //     hasMorePages = false;
      //   }
      // }
      //
      // commit("addCompLogMessage", {
      //   key: uuidv4(),
      //   color: colors.pink.accent4,
      //   title: "Completed Redfin comp search",
      //   subTitle: `Found ${compAddresses.length} comps`
      // });

      //endregion

      commit("addCompLogMessage", {
        key: uuidv4(),
        color: colors.pink.darken1,
        title: "Retrieving individual comp info",
        subTitle: `Contacting Zillow...`
      });

      const comps = [];

      for (let i = 0; i < compAddresses.length; i++) {
        commit("addCompLogMessage", {
          key: uuidv4(),
          color: colors.pink.darken1,
          title: `Retrieving comp ${i + 1} of ${compAddresses.length}`,
          subTitle: `${compAddresses[i]}`
        });

        const pr = propertyApi.getRequestVariables();
        pr.term = compAddresses[i];
        pr.search_keywords = state.search_keywords;
        pr.tag = `COMP ${state.item.streetAddress}`;
        pr.status = statuses.statuses.COMP.value;
        pr.persist = findCompsRequest.persist;
        pr.coord.latitude = state.item.latitude;
        pr.coord.longitude = state.item.longitude;

        const r = await propertyApi.findProperty(apolloClient, pr);

        if (
          _.findIndex(comps, function(c) {
            return c.id == r.data.findProperty.id;
          }) == -1
        ) {
          comps.push(r.data.findProperty);
        }
      }

      commit("setComps", comps);
      commit("setFindingComps", false);
      commit("clearCompLog");

      if (comps.length > 0) {
        const compCacheUpdateRequest = propertyApi.getRequestVariables();
        compCacheUpdateRequest.id = parseInt(state.item.id);
        compCacheUpdateRequest.search_keywords = state.search_keywords;
        compCacheUpdateRequest.input = {
          compCache: _.uniq(
            _.map(comps, function(c) {
              return c.id;
            })
          ).join(","),
          compFilterJson: JSON.stringify(state.compFilter)
        };

        dispatch("compCacheUpdate", compCacheUpdateRequest);
      }
    }
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

    const comps = response.data.findComps;

    if (comps.length > 0 && comps[0].zillow_propertyId == 0) {
      if (!requestVariables.fromAction) {
        commit("setFinding", false);
      }

      for (let i = 0; i < comps.length; i++) {
        const term = comps[i].streetAddress;
        const findPropertyRequest = propertyApi.getRequestVariables();
        findPropertyRequest.term = term;
        findPropertyRequest.tag = `COMP ${term}`;
        findPropertyRequest.status = statuses.statuses.COMP.value;
        findPropertyRequest.persist = true;

        const comp = await propertyApi.findProperty(
          apolloClient,
          findPropertyRequest
        );
        commit("pushComp", comp);
      }
    } else {
      commit("setComps", response.data.findComps);

      if (!requestVariables.fromAction) {
        commit("setFinding", false);
      }
    }
  },

  setField({ commit }, payload) {
    commit("setField", payload);
  },

  async compCacheUpdate({ commit }, requestVariables) {
    const response = await propertyApi.compCacheUpdate(
      apolloClient,
      requestVariables
    );
    commit("setItem", response.data.compCacheUpdate);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
