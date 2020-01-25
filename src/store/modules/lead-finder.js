import { apolloClient } from "../../apollo";
import * as propertyApi from "../../api/property";
import * as utilities from "../../backend/utilities/utilities";
import _ from "lodash";
import * as math from "mathjs";
import $ from "cheerio";

const PROPERTY_TAX_RATE = 0.0112;
const INSURANCE_RATE = 0.0042;

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

const scrapeProperty = async (url, getInfoUrls, req) => {
  const body = window.$("body");
  const zillowIframe = window.$("<iframe id='zillowIframe' is='x-frame-bypass' sandbox='allow-same-origin allow-scripts allow-popups allow-forms'></iframe>");

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

      if (getInfoUrls) {
        const getInfoUrlsRequest = propertyApi.getRequestVariables();
        getInfoUrlsRequest.address = property.streetAddress;

        const getInfoUrlsResponse = await propertyApi.getInfoUrls(apolloClient, getInfoUrlsRequest);
        const getInfoUrls = getInfoUrlsResponse.data.getInfoUrls;

        property.multcoproptax_url = getInfoUrls.multcoproptax_url;
        property.portlandmaps_url = getInfoUrls.portlandmaps_url;
        property.improvementsJson = getInfoUrls.improvementsJson;
        property.permitsJson = getInfoUrls.permitsJson;
      }

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

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
