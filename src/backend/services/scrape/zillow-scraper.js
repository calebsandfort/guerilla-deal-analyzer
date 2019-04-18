import rp from "request-promise";
import $ from "cheerio";
import * as utilities from "../../../utilities/utilities";
import _ from "lodash";
import Aigle from "aigle";
import { statuses } from "../../../common/enums/statuses";
import guerillaTor from "../../utilities/guerilla-tor";
import seleniumPage from "./selenium-base-page";

Aigle.mixin(_);

const FILE_PATH = "src/backend/services/scrape/files/";

export const findZillowUrl = async address => {
  let zillowUrl = "";

  if (address.toLowerCase().indexOf("portland") == -1) {
    address += " portland or";
  }

  const url = `https://www.google.com/search?q=${address
    .replace(",", "")
    .replace(".", "")
    .replace(" ", "+")}+site+zillow.com`;

  const options = {
    uri: url,
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    }
  };

  const html = await rp(options);

  const results = $("#search .srg > .g .rc > .r > a", html);

  if (results.length > 0) {
    zillowUrl = results.first().attr("href");
  }

  return zillowUrl;
};

export const findProperty = async term => {
  const property = {
    zillow_propertyId: 0,
    zillow_path: "",
    zillow_url: "",
    zillow_imageUrl: "",
    // zillow_imageUrl: '',
    streetAddress: "",
    city: "",
    state: "",
    zipcode: "",
    address: "",
    price: -1,
    // propertyTaxesAnnually: 0,
    // propertyTaxesMonthly: 0,
    // insuranceAnnually: 0,
    // insuranceMonthly: 0,
    sqft: -1,
    //listingPriceSqft: 0,
    beds: -1,
    baths: -1,
    description: "",
    zestimate: -1,
    price_to_zestimate: -1,
    date_listed: -1,
    zillow_status: "",
    year_built: -1,
    image_urls: "",
    date_sold: -1,
    latitude: -1,
    longitude: -1,
    notes: "",
    status: statuses.ACTIVE.value
  };

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

        zillowData = JSON.parse(
          $("script#hdpApolloPreloadedData", html)
            .first()
            .html()
        );

        if (zillowData == null) {
          await guerillaTor.newTorSession();
        }

        zillowData = zillowData[Object.keys(zillowData)[0]].property;

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
    }).join(",");
  } else if (zillowData.small != null && zillowData.small.length > 0) {
    property.image_urls = _.map(zillowData.small, function(item) {
      return item.url;
    }).join(",");
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

export const findComps = async ({ term = "", property = null, limit = -1 }) => {
  let comps = [];

  if (term != "" && property == null) {
    property = await findProperty(term);
  }

  // const minBeds = property.beds > 3 ? property.beds - 1 : property.beds;
  // const maxBeds = property.beds > 3 ? property.beds + 1 : property.beds;
  const minBeds = property.beds;
  const maxBeds = property.beds;
  const daysSinceSold = 180;
  const minSqft = property.sqft - property.sqft * 0.15;
  const maxSqft = property.sqft + property.sqft * 0.15;

  const longitudeOffset = (1 / 49) * 1;
  const maxLon = property.longitude + longitudeOffset;
  const minLon = property.longitude - longitudeOffset;

  const latitudeOffset = (1 / 69) * 1;
  const maxLat = property.latitude + latitudeOffset;
  const minLat = property.latitude - latitudeOffset;

  const poly = [
    { lon: maxLon, lat: maxLat },
    { lon: maxLon, lat: minLat },
    { lon: minLon, lat: minLat },
    { lon: minLon, lat: maxLat },
    { lon: maxLon, lat: maxLat }
  ];

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

  let currentPage = 1;
  let hasMorePages = true;

  while (hasMorePages) {
    let compUrl =
      "https://www.redfin.com/city/30772/OR/Portland/filter/sort=lo-distance,property-type=house";
    compUrl += `,min-beds=${minBeds}`;
    compUrl += `,max-beds=${maxBeds}`;
    compUrl += ",min-baths=1";
    compUrl += `,min-sqft=${minSqft.toFixed(0)}-sqft`;
    compUrl += `,max-sqft=${maxSqft.toFixed(0)}-sqft`;
    compUrl += ",include=sold-1yr";
    compUrl += `,viewport=${maxLat.toFixed(5)}:${minLat.toFixed(
      5
    )}:${maxLon.toFixed(5)}:${minLon.toFixed(5)}`;
    compUrl += ",no-outline";
    compUrl += `/page-${currentPage}`;

    const options = {
      uri: compUrl,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
      }
    };

    const html = await rp(options);

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
