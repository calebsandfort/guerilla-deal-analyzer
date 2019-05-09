import rp from "request-promise";
import $ from "cheerio";
import * as utilities from "../../utilities/utilities";
import { logInfo } from "../../utilities/logging";
import _ from "lodash";
import Aigle from "aigle";
import { statuses } from "../../enums/statuses";
import guerillaTor from "../../utilities/guerilla-tor";
import seleniumPage from "./selenium-base-page";
import qs from "qs";

Aigle.mixin(_);

const FILE_PATH = "src/backend/services/scrape/files/";

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

export const findZillowUrl = async address => {
  let zillowUrl = "";

  if (address.toLowerCase().indexOf("portland") == -1) {
    address += " portland or";
  }

  const params = {
    key: "AIzaSyBRVBsMsXWrLl0OKH3lu3dsmCE8UNc_jDM",
    cx: "008770600537533351055:k9v8qvgqv6w",
    num: 1,
    q: address.replaceAll(",", "").replaceAll(".", "")
  };

  const url =
    "https://www.googleapis.com/customsearch/v1?" + qs.stringify(params);

  const options = {
    uri: url
    //headers: {
    //   "user-agent":
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    // }
  };

  const html = await rp(options);

  const result = JSON.parse(html);
  const items = _.get(result, "items", []);

  if (items.length > 0) {
    zillowUrl = items[0].link;
  }

  return zillowUrl;
};

export const findProperty = async term => {
  const property = utilities.newProperty();

  let url = "";

  if (term.indexOf("homedetails") == -1) {
    url = await findZillowUrl(term);
  } else {
    url = term;
  }

  if (url.indexOf("http") == -1) {
    url = `https://www.zillow.com` + url;
  }

  const options = {
    uri: url,
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0"
    }
  };

  let zillowData = null;
  let success = false;
  let html = "";

  for (let i = 0; i < 2; i++) {
    if (!success) {
      try {
        html = await guerillaTor.request(options);

        //html = await rp(options);
        //utilities.writeFile(FILE_PATH + "zillow.html", html);

        const hdpApolloPreloadedData = $("script#hdpApolloPreloadedData", html)
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

        // zillowData = JSON.parse(
        //   $("script#hdpApolloPreloadedData", html)
        //     .first()
        //     .html()
        // );

        if (zillowData == null) {
          await guerillaTor.newTorSession();
        }

        zillowData = zillowData[Object.keys(zillowData)[dataIndex]].property;

        // utilities.writeFile(
        //   FILE_PATH + "zillowData.json",
        //   JSON.stringify(zillowData)
        // );

        success = true;
      } catch (e) {
        //await new Promise(r => setTimeout(r, 5000));
      }
    }
  }

  if (zillowData == null || zillowData.zpid == null) {
    console.log(`****************Returning Null******************`);
    return null;
  }

  property.zillow_propertyId = zillowData.zpid;
  property.zillow_path = zillowData.hdpUrl;
  property.zillow_url =
    "https://www.zillow.com" + property.zillow_path + "?fullpage=true";

  property.streetAddress = zillowData.streetAddress;
  property.city = zillowData.city;
  property.state = zillowData.state;
  property.zipcode = zillowData.zipcode;
  property.address = `${property.streetAddress}, ${property.city}, ${
    property.state
  } ${property.zipcode}`;
  utilities.setPropertyFromObject(
    zillowData,
    "livingArea",
    property,
    "sqft",
    -1
  );

  utilities.setPropertyFromObject(
    zillowData,
    "lotSize",
    property,
    "lotSize",
    -1
  );

  utilities.setPropertyFromObject(zillowData, "price", property, "price", -1);
  utilities.setPropertyFromObject(zillowData, "bedrooms", property, "beds", -1);

  if (property.beds == 0) {
    const bedSpan = $(".ds-bed-bath-living-area > span", html);
    if (bedSpan.length > 0) {
      property.beds = parseInt(bedSpan[0].text());
    }
  }

  utilities.setPropertyFromObject(
    zillowData,
    "bathrooms",
    property,
    "baths",
    -1
  );
  utilities.setPropertyFromObject(
    zillowData,
    "description",
    property,
    "description",
    ""
  );
  utilities.setPropertyFromObject(
    zillowData,
    "zestimate",
    property,
    "zestimate",
    -1
  );
  property.price_to_zestimate =
    property.zestimate == -1
      ? 1000
      : parseFloat((property.price / property.zestimate).toFixed(2));
  property.zillow_status = zillowData.homeStatus;

  utilities.setPropertyFromObject(
    zillowData,
    "resoFacts.onMarketDate",
    property,
    "date_listed",
    -1
  );

  property.year_built = extractAtAGlanceValues(
    zillowData,
    "Year Built",
    parseInt,
    0
  );

  if (isNaN(property.year_built)) {
    property.year_built = 1850;
  }

  if (
    zillowData.responsivePhotos != null &&
    zillowData.responsivePhotos.length > 0
  ) {
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

  utilities.setPropertyFromObject(
    zillowData,
    "dateSold",
    property,
    "date_sold",
    -1
  );

  utilities.setPropertyFromObject(
    zillowData,
    "latitude",
    property,
    "latitude",
    -1
  );

  utilities.setPropertyFromObject(
    zillowData,
    "longitude",
    property,
    "longitude",
    -1
  );

  return property;
};

export const findProperties = async terms => {
  const properties = [];

  for (let i = 0; i < terms.length; i++) {
    properties.push(await findProperty(terms[i]));
  }

  return properties;
};

export const trialScrape = async (url, filename = "") => {
  const options = {
    uri: url,
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    }
  };

  console.log(url);

  const html = await rp(options);

  if (filename != "") {
    utilities.writeFile(FILE_PATH + `${filename}.html`, html);
  }

  return [];
};

export const trialSelenium = async theUrl => {
  const page = new seleniumPage();
  await page.visit(theUrl);
  await page.sleep(20000);

  await page.quit();

  return [];
};

export const findPropertyTaxInfo = async property => {
  const propertyTaxInfo = {};

  //https://multcoproptax.com/Property-Search?searchtext=4544%20N%20Kerby%20Ave

  let options = {
    uri: "https://multcoproptax.com/Property-Search",
    qs: {
      searchtext: property.streetAddress
    }
  };

  const searchUrl =
    "https://multcoproptax.com/Property-Search?" +
    qs.stringify({
      searchtext: property.streetAddress
    });
  const page = new seleniumPage();
  await page.visit(searchUrl);

  const tableRow = await page.findByCss("tr[data-uid]");
  await tableRow.click();

  // let html = await guerillaTor.request(options);
  //
  // const jsonInput = $("input[id$=_SearchResultJson]", html);

  // if (jsonInput.length > 0) {
  //   const searchResult = JSON.parse(jsonInput[0].attribs["value"]);
  //   const resultList = _.get(searchResult, "ResultList", []);
  //   if (resultList.length > 0) {
  //     //https://multcoproptax.com/Property-Detail?PropertyQuickRefID=R135723&PartyQuickRefID=O132014
  //
  //     const url =
  //       "https://multcoproptax.com/Property-Detail?" + qs.stringify({
  //         PropertyQuickRefID: resultList[0].PropertyQuickRefID,
  //         PartyQuickRefID: resultList[0].PartyQuickRefID
  //       });
  //
  //     //debugger;
  //
  //     //https://multcoproptax.com/Property-Detail?PropertyQuickRefID=R135723&PartyQuickRefID=O132014
  //     //https://multcoproptax.com/Property-Detail?PropertyQuickRefID=R135723&PartyQuickRefID=O132014
  //
  //     options = {
  //       uri: url,
  //       // qs: {
  //       //   PropertyQuickRefID: resultList[0].PropertyQuickRefID,
  //       //   PartyQuickRefID: resultList[0].PartyQuickRefID
  //       // }
  //     };
  //
  //     html = await guerillaTor.request(options);
  //   }
  // }

  // JSON
  //   ResultList
  //     0
  //       PropertyQuickRefID : "R135723"
  //       PartyQuickRefID : "O132014"
  //       OwnerQuickRefID : "R135723"
  //       LegacyID : null
  //       PropertyNumber : "R135723"
  //       OwnerName : "JONES,LEE ROY & JONES,CARROL"
  //       SitusAddress : "4544 N KERBY AVE, PORTLAND, OR 97217"
  //       PropertyValue : 82560
  //       LegalDescription : "CLIFFORD ADD, LOT Q"
  //       NeighborhoodCode : "R163"
  //       Abstract : null
  //       Subdivision : "CLIFFORD ADD"
  //       PropertyType : "Real"
  //       AltAccountNo : "R163904050"
  //       CustomID : null
  //       ID : 0
  //       Text : null
  //       TaxYear : 2019
  //       PropertyValueTaxYear : 2018
  //       HasMoreData : false
  //       TotalPageCount : 1
  //       CurrentPage : 1
  //       RecordCount : 1
  //       SearchText : "4544 N Kerby Ave"
  //       PagingHandledByCaller : false
  //       TaxYear : 2019
  //       PropertyValueTaxYear : 0

  return propertyTaxInfo;
};

export const findComps = async ({
  term = "",
  property = null,
  compFilter = {
    minBeds: -1,
    maxBeds: -1,
    minSqft: -1,
    maxSqft: -1,
    minLotSqft: -1,
    maxLotSqft: -1,
    minYearBuilt: -1,
    maxYearBuilt: -1,
    minBaths: -1,
    searchDistance: 1
  },
  limit = -1
}) => {
  let comps = [];

  if (term != "" && property == null) {
    property = await findProperty(term);
  }

  //min-year-built=1950
  //max-year-built=2019
  //min-lot-size=4.5k-sqft
  //max-lot-size=2-acre

  //region Example url
  //https://www.redfin.com/city/30772/OR/Portland/filter/
  // sort=lo-distance,
  // property-type=house,
  // min-beds=2,
  // max-beds=3,
  // min-baths=1,
  // min-sqft=750-sqft,
  // max-sqft=1.25k-sqft,
  // include=sold-6mo,
  // viewport=45.48965:45.46841:-122.54015:-122.58714,
  // no-outline
  // /page-1

  //https://www.redfin.com/city/30772/OR/Portland/filter/sort=lo-distance,property-type=house,min-beds=2,max-beds=3,min-baths=1,min-sqft=750-sqft,max-sqft=1.25k-sqft,include=sold-6mo,viewport=45.48965:45.46841:-122.54015:-122.58714,no-outline/page-2
  //https://www.redfin.com/city/30772/OR/Portland/filter/sort=lo-distance,property-type=house,min-beds=3,max-beds=5,min-baths=1,min-sqft=2077-sqft,max-sqft=2809-sqft,include=sold-9mo,viewport=45.51157:45.48983:-122.66397:-122.69458,no-outline/page-1
  //endregion

  // console.log(compFilter);

  let currentPage = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    let compUrl = utilities.buildRedfinCompUrl(
      property,
      compFilter,
      currentPage
    );

    logInfo(
      "scrapeComps",
      [
        {
          message: `page`,
          term: currentPage
        }
      ],
      "magenta"
    );

    // if (compUrl != "") {
    //   console.log(compUrl);
    //   return;
    // }

    const options = {
      uri: compUrl,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
      }
    };

    let html = await guerillaTor.request(options);

    const captcha = $("#captcha", html);
    if (captcha.length > 0 || html.indexOf("is blocked") > -1) {
      logInfo(
        "scrapeComps",
        [
          {
            message: "tor",
            term: "new ip"
          }
        ],
        "red"
      );

      await guerillaTor.newTorSession();
      await new Promise(r => setTimeout(r, 1000 * 15));

      compUrl = utilities.buildRedfinCompUrl(property, compFilter, currentPage);
      options.uri = compUrl;

      html = await guerillaTor.request(options);
    }

    if (html.indexOf("is blocked") > -1) {
      logInfo(
        "scrapeComps",
        [
          {
            message: "blocked",
            term: "blocked"
          }
        ],
        "red"
      );
    }

    const results = $(
      ".HomeViews .HomeCardContainer > .HomeCard > .v2 > a",
      html
    );

    comps = _.concat(
      comps,
      _.map(results, function(item) {
        return $(item).attr("title");
      })
    );

    const nextPage = $(
      ".PagingControls button:not(.disabled) .slide-next",
      html
    );
    if (nextPage.length > 0) {
      currentPage += 1;
    } else {
      hasMorePages = false;
    }
  }

  //console.log(comps);

  return comps;
};

const buildEstatelyCompUrl = (property, compFilter, currentPage) => {
  //https://www.estately.com/45.4571,-122.6825,45.4811,-122.6247?
  // max_days_listed=365
  // &max_feet=2000
  // &max_feet_lot=87120
  // &max_year_built=2018
  // &min_bath=1
  // &min_bed=2
  // &min_feet=1400
  // &min_feet_lot=2000
  // &min_year_built=1900
  // &only_sold=sold
  // &property_type=house
};

const buildRealtorCompUrl = (property, compFilter, currentPage) => {
  //$("#srp-list .listing-street-address").length

  //https://www.realtor.com/soldhomeprices
  // /97202/beds-2-3
  // /baths-1
  // /type-single-family-home
  // /sqft-1442-3000
  // /age-100+
  // /radius-1
  // /pg-2?pos=45.432711,-122.724643,45.527917,-122.565428,13

  //region Coords
  const longitudeOffset = (1 / 49) * compFilter.searchDistance;
  const longitudeRandomOffset = longitudeOffset / 10;

  const maxLon =
    property.longitude +
    longitudeOffset +
    _.random(0, longitudeRandomOffset, true);
  const minLon =
    property.longitude -
    longitudeOffset +
    _.random(0, longitudeRandomOffset, true);

  const latitudeOffset = (1 / 69) * compFilter.searchDistance;
  const latitudeRandomOffset = longitudeOffset / 10;

  const maxLat =
    property.latitude +
    latitudeOffset +
    _.random(0, latitudeRandomOffset, true);
  const minLat =
    property.latitude -
    latitudeOffset +
    _.random(0, latitudeRandomOffset, true);
  //endregion

  let compUrl = `https://www.realtor.com/soldhomeprices/`;
};

const setPrice = (property, zillowData) => {
  switch (property.zillow_status) {
    case "FOR_SALE":
    case "PENDING":
      property.price = zillowData.listingPrice;
      break;
    default:
      property.price = zillowData.price;
      break;
  }
};

export const parseNumberFromElement = (el, func) => {
  return func(
    el
      .text()
      .replace(",", "")
      .replace("$", "")
  );
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
