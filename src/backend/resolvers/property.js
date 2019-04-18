import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";
import * as zillowScraper from "../services/scrape/zillow-scraper";
import _ from "lodash";
import moment from "moment";
import * as statuses from "../../common/enums/statuses";
import * as engagements from "../../common/enums/engagements";
import { logInfo } from "../utilities/logging";
import { getDistance } from "../../utilities/utilities";

//region Query
//region properties
const properties = async (
  parent,
  { offset = 0, limit = 0, order = "id DESC" },
  { models }
) => {
  const params = {};

  if (limit > 0) {
    params.offset = offset;
    params.limit = limit;
  }

  if (order != "") {
    params.order = Sequelize.literal(order);
  }

  return await models.Property.findAll(params);
};
//endregion

//region propertiesQueryable
const propertiesQueryable = async (parent, { query }, { models }) => {
  const params = entityQuery.entityQueryToSequelize(query);
  return await models.Property.findAll(params);
};
//endregion

//region property
const property = async (parent, { id }, { models }) => {
  return await models.Property.findByPk(id);
};
//endregion

//region findProperty
const findProperty = async (
  parent,
  { term, tag, status = statuses.statuses.ACTIVE.value, persist = true },
  { models }
) => {
  let property = await findPropertyHelper(term, models, tag, status, persist);

  return property;
};
//endregion

//region findProperties
const findProperties = async (
  parent,
  { terms, tag, status = statuses.statuses.ACTIVE.value, persist = true },
  { models }
) => {
  const properties = [];
  let counter = 0;

  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    let property = await findPropertyHelper(
      term,
      models,
      tag,
      status,
      persist,
      {
        current: i + 1,
        total: terms.length
      }
    );

    if (property) {
      properties.push(property);
    }

    if (counter > 50) {
      await new Promise(r => setTimeout(r, 1000 * 15));
      counter = 0;
    } else {
      counter += 1;
    }
  }

  return properties;
};
//endregion

//region findComps
const findComps = async (
  parent,
  { id, term, tag, status = statuses.statuses.ACTIVE.value, persist = true },
  { models }
) => {
  let property = null;

  if (id > 0) {
    property = await models.Property.findByPk(id);
  } else if (term != "") {
    property = await findPropertyHelper(
      term,
      models,
      "FIND_COMPS",
      status,
      persist
    );
  }

  const compAddresses = await zillowScraper.findComps({ property: property });

  const comps = await findProperties(
    parent,
    {
      terms: compAddresses,
      tag: `COMP ${property.streetAddress}`,
      status: statuses.statuses.COMP.value,
      persist: persist
    },
    { models }
  );

  return comps;
};
//endregion
//endregion

export default {
  Query: {
    properties,
    propertiesQueryable,
    property,
    findProperty,
    findProperties,
    findComps
  },

  Mutation: {
    createProperty: async (parent, { input }, { models }) => {
      const property = await models.Property.create(input);

      const collectionPromises = [];

      return property;
    },

    updateProperty: async (parent, { id, input }, { models }) => {
      const property = await models.Property.findByPk(id);
      return await property.update(input);
    },

    expandoPropertyUpdate: async (parent, { id, input }, { models }) => {
      const property = await models.Property.findByPk(id);
      return await property.update(input);
    },

    deleteProperty: async (parent, { id }, { models }) => {
      return await models.Property.destroy({
        where: { id }
      });
    }
  },

  Property: {
    streetPlusZip: property => `${property.streetAddress}, ${property.zipcode}`,
    fullAddress: property =>
      `${property.streetAddress}, ${property.city}, ${property.state} ${
        property.zipcode
      }`,
    keywords: (property, { search_keywords = [] }) => {
      const lowerCaseDescription = property.description.toLowerCase();
      return _.filter(search_keywords, function(skw) {
        return lowerCaseDescription.indexOf(skw.toLowerCase()) > -1;
      });
    },
    keywords_count: (property, { search_keywords = [] }) => {
      const lowerCaseDescription = property.description.toLowerCase();
      return _.filter(search_keywords, function(skw) {
        return lowerCaseDescription.indexOf(skw.toLowerCase()) > -1;
      }).length;
    },
    keywords_set: (property, { search_keywords = [] }) => {
      return search_keywords.length > 0;
    },
    days_listed: property => {
      return moment().diff(moment(property.date_listed, "x"), "days");
    },
    days_since_sold: property => {
      return property.date_sold > 0
        ? moment().diff(moment(property.date_sold, "x"), "days")
        : -1;
    },
    image_urls_list: property => {
      if (property.image_urls) {
        return property.image_urls.split(",");
      }

      return [];
    },
    status_display: property => {
      return statuses.getDisplayForValue(property.status);
    },
    distance: (property, { coord = { latitude: 0, longitude: 0 } }) => {
      if (coord.latitude != 0 && coord.longitude != 0) {
        return getDistance(property, coord);
      } else {
        return 0;
      }
    },
    distance_set: (property, { coord = { latitude: 0, longitude: 0 } }) => {
      return coord.latitude != 0 && coord.longitude != 0;
    },
    engagement: property => {
      return engagements.engagements.NONE.value;
    }
  }
};

//region Helpers
const findPropertyHelper = async (
  term,
  models,
  tag,
  status = statuses.statuses.ACTIVE.value,
  persist = true,
  collectionInfo = null
) => {
  const logRows = [];

  if (collectionInfo) {
    logRows.push({
      message: "record",
      term: `${collectionInfo.current} of ${collectionInfo.total}`
    });
  }

  logRows.push({
    message: "finding",
    term
  });

  let property = await models.Property.findOne({
    where: {
      [Sequelize.Op.or]: [
        { zillow_path: term },
        { streetAddress: term },
        { address: term }
      ]
    }
  });

  if (property == null && term.indexOf("homedetails") == -1) {
    const zillowUrl = await zillowScraper.findZillowUrl(term);
    logRows.push({
      message: "check zillow",
      term: zillowUrl.replace("https://www.zillow.com", "")
    });

    property = await models.Property.findOne({
      where: {
        zillow_url: zillowUrl + "?fullpage=true"
      }
    });

    if (property == null) {
      logRows.push({
        message: "scraping zillow",
        term: zillowUrl.replace("https://www.zillow.com", "")
      });

      if (zillowUrl.indexOf("homedetails") > -1) {
        const scrapedProperty = await zillowScraper.findProperty(zillowUrl);
        if (scrapedProperty) {
          scrapedProperty.tag = tag;
          scrapedProperty.status = status;

          if (persist) {
            property = await models.Property.create(scrapedProperty);
          } else {
            property = scrapedProperty;
          }

          logRows.push({
            message: "scraped zillow",
            term: zillowUrl.replace("https://www.zillow.com", "")
          });
        }
      }
    }
  }

  logRows.push({
    message: property == null ? "not found" : "found",
    term
  });

  logInfo("findPropertyHelper", logRows, property == null ? "red" : "green");

  return property;
};
//endregion
