import rp from "request-promise";
import $ from "cheerio";
import * as utilities from "../../../utilities/utilities";
import _ from "lodash";
import moment from "moment";
import { moods } from "../../../common/enums/moods";

const FILE_PATH = "src/backend/services/scrape/files/";

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
    mood: moods.ACTIVE.value
  };

  let url = term;

  if (!url.startsWith("/")) {
    url = `https://www.zillow.com/homes/${term.replace(" ", "-")}_rb/`;
  }

  if (url.indexOf("http") == -1) {
    url = `https://www.zillow.com` + url;
  }

  console.log(url);

  const options = {
    uri: url,
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    }
  };

  let zillowData = null;
  let success = false;
  let html = "";

  for (let i = 0; i < 3; i++) {
    if (!success) {
      try {
        const html = await rp(options);
        //utilities.writeFile(FILE_PATH + "zillow.html", html);

        zillowData = JSON.parse(
          $("script#hdpApolloPreloadedData", html)
            .first()
            .html()
        );

        if (zillowData == null) {
          throw "Null zillowData";
        }

        // utilities.writeFile(
        //   FILE_PATH + "zillowData.json",
        //   JSON.stringify(zillowData)
        // );

        zillowData = zillowData[Object.keys(zillowData)[0]].property;
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
  utilities.setPropertyFromObject(
    zillowData,
    "livingArea",
    property,
    "sqft",
    -1
  );

  utilities.setPropertyFromObject(zillowData, "price", property, "price", -1);
  utilities.setPropertyFromObject(zillowData, "bedrooms", property, "beds", -1);
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

  property.date_listed = extractAtAGlanceValues(
    zillowData,
    "Days on Zillow",
    function(x) {
      x = x.replace(" Days", "").replace(" Day", "");
      x = parseInt(x);
      return parseInt(
        moment()
          .subtract(x, "days")
          .format("x")
      );
    },
    0
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
      return item.mixedSources.jpeg[1].url;
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

  // console.log(
  //   `****************${zillowData.photoCount}, ${
  //     zillowData.small.length
  //   }, ${property.image_urls == ""}******************`
  // );

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
