import rp from "request-promise";
import $ from "cheerio";
import * as utilities from "../../../utilities/utilities";
import _ from "lodash";
import moment from "moment";

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
    price: 0,
    // propertyTaxesAnnually: 0,
    // propertyTaxesMonthly: 0,
    // insuranceAnnually: 0,
    // insuranceMonthly: 0,
    sqft: 0,
    //listingPriceSqft: 0,
    beds: 0,
    baths: 0,
    description: "",
    zestimate: 0,
    price_to_zestimate: 0,
    date_listed: 0,
    zillow_status: "",
    year_built: 0
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

        // utilities.writeFile(
        //   FILE_PATH + "zillowData.json",
        //   JSON.stringify(zillowData)
        // );

        zillowData = zillowData[Object.keys(zillowData)[0]].property;
        success = true;
      } catch (e) {}
    }
  }

  if (zillowData.zpid == null) {
    return null;
  }

  property.zillow_propertyId = zillowData.zpid;
  property.zillow_path = zillowData.hdpUrl;
  property.zillow_url =
    "https://www.zillow.com" + property.zillow_path + "?fullpage=true";

  if (
    property.zillow_imageUrl === "" &&
    _.get(zillowData, "small", []).length > 0
  ) {
    property.zillow_imageUrl = zillowData.small[0].url;
  }

  if (property.zillow_imageUrl === "") {
    property.zillow_imageUrl = _.get(zillowData, "mediumImageLink", "");
  }

  property.streetAddress = zillowData.streetAddress;
  property.city = zillowData.city;
  property.state = zillowData.state;
  property.zipcode = zillowData.zipcode;
  utilities.setPropertyFromObject(
    zillowData,
    "sqft",
    property,
    "livingArea",
    -1
  );
  utilities.setPropertyFromObject(zillowData, "beds", property, "bedrooms", -1);
  utilities.setPropertyFromObject(
    zillowData,
    "baths",
    property,
    "bathrooms",
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
