import { apolloClient } from "../../apollo";
import * as propertyApi from "../../api/property";
import _ from "lodash";
import * as utilities from "../../backend/utilities/utilities";
import * as statuses from "../../backend/enums/statuses";
import colors from "vuetify/es5/util/colors";
import uuidv4 from "uuid/v4";
import DealAnalysisProxy from "../../backend/utilities/DealAnalysisProxy";
import VariableDealCalculator from "../../backend/utilities/VariableDealCalculator";
import $ from "cheerio";
import * as math from "mathjs";

const PROPERTY_TAX_RATE = 0.0112;
const INSURANCE_RATE = 0.0042;

const state = {
  debugDealAnalysis: false,
  discountThreshold: 0.05,
  encodedImage: "",
  mapImage: "",
  item: null,
  spotlightItem: null,
  comps: [],
  dealComps: [],
  compFilter: utilities.defaultCompFilter(),
  finding: false,
  findingComps: false,
  crunchingVariableDeals: false,
  pullingCompsFromCache: false,
  compLog: [],
  search_keywords: ["remodel", "update", "hardwood", "hard wood", "new", "granite"],
  arv: 0,
  repairEstimate: utilities.newRepairEstimate(),
  dealAnalysis: utilities.newDealAnalysis(),
  dealAnalysisProxy: new DealAnalysisProxy(utilities.newDealAnalysis()),
  dealAnalysisSections: utilities.dealAnalysisSections(utilities.newDealAnalysis()),
  variableDealCalculator: new VariableDealCalculator(),
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
  },
  addRepairEstimateLineItemSubSectionKey: "",
  variableDeals: {
    comboLineItems: [],
    rehabLineItems: [],
    roiLineItems: []
  }
};

const getters = {};

export const mutations = {
  //region Property Mutations
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
  //endregion

  //region Comp Mutations
  setFindingComps(state, findingComps) {
    state.findingComps = findingComps;
  },
  setPullingCompsFromCache(state, pullingCompsFromCache) {
    state.pullingCompsFromCache = pullingCompsFromCache;
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
  addCompLogMessage(state, payload) {
    state.compLog = [payload, ...state.compLog];
  },
  clearCompLog(state) {
    state.compLog = [];
  },
  //endregion

  //region Repair Estimate Mutations
  setRepairEstimateSqft(state) {
    const re = utilities.newRepairEstimate();
    if (state.item != null) utilities.setRepairEstimateSqft(re, state.item.sqft);
    state.repairEstimate = re;
  },
  updateRepairEstimateLineItem(state, payload) {
    const temp = Object.assign({}, state.repairEstimate);
    utilities.updateRepairEstimateLineItem(temp, payload.key, payload.field, payload.val);

    state.repairEstimate = temp;
  },
  addRepairEstimateLineItem(state, payload) {
    const temp = Object.assign({}, state.repairEstimate);
    utilities.addRepairEstimateLineItem(temp, state.addRepairEstimateLineItemSubSectionKey, payload);

    state.repairEstimate = temp;
  },
  reconcileDealAnalysis(state) {
    if (
      state.dealAnalysisProxy.setField([
        {
          field: "DF_RepairCosts",
          val: state.repairEstimate.totalCost
        },
        {
          field: "DF_ARV",
          val: state.arv
        }
      ])
    ) {
      state.dealAnalysis = Object.assign({}, state.dealAnalysisProxy.dealAnalysis);
    }
  },
  //endregion

  //region Deal Analysis Mutations
  updateDealAnalysisForProperty(state) {
    state.arv = state.item.zestimate > 0 ? state.item.zestimate : state.item.price;
    state.dealAnalysisProxy.updateForProperty(state.item);
    state.dealAnalysis = Object.assign({}, state.dealAnalysisProxy.dealAnalysis);
  },
  //endregion

  //region Misc Mutations
  setField(state, payload) {
    const names = payload.name.split(",");

    for (let i = 0; i < names.length; i++) {
      if (!names[i].startsWith("dealAnalysis.")) {
        _.set(state, names[i], payload.v);
      }
    }

    const pairs = _.map(
      _.filter(names, function(f) {
        return f.startsWith("dealAnalysis.");
      }),
      function(x) {
        return { field: x.replace("dealAnalysis.", ""), val: payload.v };
      }
    );

    if (state.dealAnalysisProxy.setField(pairs)) {
      state.dealAnalysis = Object.assign({}, state.dealAnalysisProxy.dealAnalysis);
    }
  }
  //endregion
};

const scrapeProperty = async (url, req) => {
  const body = window.$("body");
  const zillowIframe = window.$("<iframe id='zillowIframe' is='x-frame-bypass'></iframe>");

  zillowIframe.attr("src", url);

  body.append(zillowIframe);

  let foundData = false;
  let whileCount = 0;

  while (!foundData && whileCount < 10) {
    await utilities.pause(2.5);

    if (window.$(window.$(zillowIframe[0]).attr("srcdoc")).find("script#hdpApolloPreloadedData").length > 0) {
      foundData = true;
    }

    whileCount += 1;
  }

  // const zillowHtml = window.$(window.$(zillowIframe[0]).attr("srcdoc"));
  zillowIframe.remove();

  let zillowData = {};

  const html = window.$(zillowIframe[0]).attr("srcdoc");

  try {
    const hdpApolloPreloadedData = window
      .$(html)
      .find("script#hdpApolloPreloadedData")
      .first()
      .html();
    const data = JSON.parse(hdpApolloPreloadedData);
    const apiCache = _.get(data, "apiCache", "");
    let dataIndex = 0;

    if (apiCache != "") {
      zillowData = JSON.parse(apiCache);
      dataIndex = 1;
    } else {
      zillowData = data;
    }

    if (zillowData != null) {
      zillowData = zillowData[Object.keys(zillowData)[dataIndex]].property;
      const property = utilities.newProperty();

      //region populate
      property.zillow_propertyId = parseInt(zillowData.zpid);
      property.zillow_path = zillowData.hdpUrl;
      property.zillow_url = "https://www.zillow.com" + property.zillow_path + "?fullpage=true";

      property.streetAddress = zillowData.streetAddress;
      property.city = zillowData.city;
      property.state = zillowData.state;
      property.zipcode = zillowData.zipcode;
      property.address = `${property.streetAddress}, ${property.city}, ${property.state} ${property.zipcode}`;
      utilities.setPropertyFromObject(zillowData, "livingArea", property, "sqft", -1);

      utilities.setPropertyFromObject(zillowData, "lotSize", property, "lotSize", -1);

      utilities.setPropertyFromObject(zillowData, "price", property, "price", -1);
      utilities.setPropertyFromObject(zillowData, "bedrooms", property, "beds", -1);

      property.propertyTaxesAnnually = math
        .chain(property.price * PROPERTY_TAX_RATE)
        .toFloat(0)
        .done();
      property.propertyTaxesMonthly = math
        .chain(property.propertyTaxesAnnually / 12)
        .toFloat(0)
        .done();

      property.insuranceAnnually = math
        .chain(property.price * INSURANCE_RATE)
        .toFloat(0)
        .done();
      property.insuranceMonthly = math
        .chain(property.insuranceAnnually / 12)
        .toFloat(0)
        .done();

      if (property.beds == 0) {
        const bedSpan = $(".ds-bed-bath-living-area > span", html);
        if (bedSpan.length > 0) {
          property.beds = parseInt(bedSpan[0].text());
        }
      }

      utilities.setPropertyFromObject(zillowData, "bathrooms", property, "baths", -1);
      utilities.setPropertyFromObject(zillowData, "description", property, "description", "");
      utilities.setPropertyFromObject(zillowData, "zestimate", property, "zestimate", -1);
      property.price_to_zestimate = property.zestimate == -1 ? 1000 : parseFloat((property.price / property.zestimate).toFixed(2));
      property.zillow_status = zillowData.homeStatus;

      utilities.setPropertyFromObject(zillowData, "resoFacts.onMarketDate", property, "date_listed", "-1");
      property.date_listed = property.date_listed.toString();

      property.year_built = extractAtAGlanceValues(zillowData, "Year Built", parseInt, 0);

      if (isNaN(property.year_built)) {
        property.year_built = 1850;
      }

      if (zillowData.responsivePhotos != null && zillowData.responsivePhotos.length > 0) {
        property.image_urls = _.map(zillowData.responsivePhotos, function(item) {
          return item.mixedSources.jpeg[2].url;
        }).join("|");
      } else if (zillowData.small != null && zillowData.small.length > 0) {
        property.image_urls = _.map(zillowData.small, function(item) {
          return item.url;
        }).join("|");
      } else {
        // utilities.writeFile(
        //   FILE_PATH + "zillowData.json",
        //   JSON.stringify(zillowData)
        // );
        property.image_urls = "";
      }

      utilities.setPropertyFromObject(zillowData, "dateSold", property, "date_sold", "-1");
      property.date_sold = property.date_sold.toString();

      utilities.setPropertyFromObject(zillowData, "latitude", property, "latitude", -1);

      utilities.setPropertyFromObject(zillowData, "longitude", property, "longitude", -1);
      //endregion

      let createPropertyRequest = propertyApi.getRequestVariables();

      if (typeof req != "undefined" && req != null) {
        createPropertyRequest = req;
      }

      createPropertyRequest.input = property;

      return (await propertyApi.create(apolloClient, createPropertyRequest)).data.createProperty;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

const extractAtAGlanceValues = (data, factLabel, parseFunc, defaultValue) => {
  const atAGlanceFacts = _.get(data, "homeFacts.atAGlanceFacts", []);

  if (atAGlanceFacts && atAGlanceFacts.length > 0) {
    const fact = _.find(atAGlanceFacts, function(f) {
      return f.factLabel == factLabel;
    });

    if (typeof fact != "undefined" && fact.factValue != null) {
      return parseFunc(fact.factValue);
    }
  }

  return defaultValue;
};

export const actions = {
  //region Property Actions
  async fetchItem({ dispatch, commit, state }, requestVariables) {
    commit("setFinding", true);
    const response = await propertyApi.get(apolloClient, requestVariables);
    commit("setItem", response.data.property);
  },

  async findItem({ dispatch, commit, state }, requestVariables) {
    commit("setFinding", true);
    const findProperty = await propertyApi.findProperty(apolloClient, requestVariables);

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
    const findProperty = await propertyApi.findProperty(apolloClient, requestVariables);

    const findPropertyResponse = findProperty.data.findProperty;
    let property = null;

    if (findPropertyResponse.property != null) {
      property = findPropertyResponse.property;
    } else {
      property = await scrapeProperty(findPropertyResponse.url);
    }

    if (state.debugDealAnalysis) {
      property.propertyTaxesAnnually = 3500;
      property.insuranceAnnually = 600;
    }

    commit("setItem", property);
    commit("setRepairEstimateSqft");
    commit("updateDealAnalysisForProperty");
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

  async encodeImage({ dispatch, commit, state }, { image_url, field }) {
    const reqVar = propertyApi.getRequestVariables();
    reqVar.image_url = image_url;
    const response = await propertyApi.encodeImage(apolloClient, reqVar);

    commit("setField", {
      name: field,
      v: response.data.encodeImage
    });
  },
  //endregion

  //region Comp Actions
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

      const response = await propertyApi.findProperties(apolloClient, compCacheRequest);

      commit(
        "setComps",
        _.map(response.data.findProperties, function(x) {
          return x.property;
        })
      );
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

        let compUrl = utilities.buildZillowCompUrl(state.item, state.compFilter, currentPage);

        const zillowIframe = window.$("<iframe id='zillowIframe' is='x-frame-bypass'></iframe>");

        zillowIframe.attr("src", compUrl);

        body.append(zillowIframe);

        await utilities.pause(20);

        // const zillowHtml = window.$(window.$(zillowIframe[0]).attr("srcdoc"));
        zillowIframe.remove();

        let results = window.$(window.$(zillowIframe[0]).attr("srcdoc")).find(".zsg-photo-card-address");

        if (results.length == 0) {
          results = window.$(window.$(zillowIframe[0]).attr("srcdoc")).find(".list-card-addr");
        }

        compAddresses = _.concat(
          compAddresses,
          _.map(results, function(item) {
            return window.$(item).html();
          })
        );

        const nextPage = window.$(window.$(zillowIframe[0]).attr("srcdoc")).find(".zsg-pagination-next");
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

        const findPropertyRequest = propertyApi.getRequestVariables();
        findPropertyRequest.term = compAddresses[i];
        findPropertyRequest.search_keywords = state.search_keywords;
        findPropertyRequest.tag = `COMP ${state.item.streetAddress}`;
        findPropertyRequest.status = statuses.statuses.COMP.value;
        findPropertyRequest.persist = findCompsRequest.persist;
        findPropertyRequest.coord.latitude = state.item.latitude;
        findPropertyRequest.coord.longitude = state.item.longitude;
        const findProperty = await propertyApi.findProperty(apolloClient, findPropertyRequest);

        const findPropertyResponse = findProperty.data.findProperty;
        let comp = null;

        if (findPropertyResponse.property != null) {
          comp = findPropertyResponse.property;
        } else {
          comp = await scrapeProperty(findPropertyResponse.url, findPropertyRequest);
        }

        if (
          comp != null &&
          _.findIndex(comps, function(c) {
            return c.id == comp.id;
          }) == -1
        ) {
          comps.push(comp);
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

    const response = await propertyApi.findComps(apolloClient, requestVariables);

    const comps = response.data.findComps;

    if (comps.length > 0 && comps[0].zillow_propertyId == 0) {
      if (!requestVariables.fromAction) {
        commit("setFinding", false);
      }

      for (let i = 0; i < comps.length; i++) {
        const term = comps[i].streetAddress;

        const findPropertyRequest = propertyApi.getRequestVariables();
        findPropertyRequest.term = term;
        const findProperty = await propertyApi.findProperty(apolloClient, findPropertyRequest);

        const findPropertyResponse = findProperty.data.findProperty;
        let comp = null;

        if (findPropertyResponse.property != null) {
          comp = findPropertyResponse.property;
        } else {
          comp = await scrapeProperty(findPropertyResponse.url);
        }

        commit("pushComp", comp);
      }
    } else {
      commit("setComps", response.data.findComps);

      if (!requestVariables.fromAction) {
        commit("setFinding", false);
      }
    }
  },

  async compCacheUpdate({ commit }, requestVariables) {
    const response = await propertyApi.compCacheUpdate(apolloClient, requestVariables);
    commit("setItem", response.data.compCacheUpdate);
  },
  //endregion

  //region Deal Analysis Actions
  async reconcileDealAnalysis({ dispatch, commit, state }, findCompsRequest) {
    commit("reconcileDealAnalysis");
    //dispatch("crunchVariableDeals");
  },

  async crunchVariableDeals({ dispatch, commit, state }) {
    commit("setField", { name: "crunchingVariableDeals", v: true });

    const variableDealCalculator = new VariableDealCalculator();
    await variableDealCalculator.generateDeals(state.dealAnalysis);

    commit("setField", {
      name: "variableDeals",
      v: {
        comboLineItems: variableDealCalculator.comboLineItems,
        rehabLineItems: variableDealCalculator.rehabLineItems,
        roiLineItems: variableDealCalculator.roiLineItems
      }
    });

    commit("setField", { name: "crunchingVariableDeals", v: false });
  },
  //endregion

  //region Misc Actions
  setField({ commit }, payload) {
    commit("setField", payload);
  }
  //endregion
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
