import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";
import * as zillowScraper from "../services/scrape/zillow-scraper";
import _ from "lodash";
import moment from "moment";
import * as statuses from "../../common/enums/statuses";

export default {
  Query: {
    properties: async (
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
    },
    propertiesQueryable: async (parent, { query }, { models }) => {
      const params = entityQuery.entityQueryToSequelize(query);
      return await models.Property.findAll(params);
    },
    property: async (parent, { id }, { models }) => {
      return await models.Property.findByPk(id);
    },
    findProperty: async (
      parent,
      { term, tag, status = statuses.statuses.ACTIVE.value },
      { models }
    ) => {
      let property = await models.Property.findOne({
        where: { zillow_path: term }
      });
      if (property == null) {
        const scrapedProperty = await zillowScraper.findProperty(term);
        if (scrapedProperty) {
          scrapedProperty.tag = tag;
          scrapedProperty.status = status;
          property = await models.Property.create(scrapedProperty);
        } else {
          return null;
        }
      }

      return property;
    },
    findProperties: async (
      parent,
      { terms, tag, status = statuses.statuses.ACTIVE.value },
      { models }
    ) => {
      const properties = [];

      for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        let property = await models.Property.findOne({
          where: { zillow_path: term }
        });
        if (property == null) {
          const scrapedProperty = await zillowScraper.findProperty(term);
          if (scrapedProperty) {
            scrapedProperty.tag = tag;
            scrapedProperty.status = status;
            property = await models.Property.create(scrapedProperty);
          }
        }

        properties.push(property);
      }

      return properties;
    }
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
    keywords: property => {
      return [];
    },
    keywords_count: property => {
      return 0;
    },
    keywords_set: property => {
      return false;
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
    distance: property => {
      return 0;
    },
    distance_set: property => {
      return false;
    }
  }
};
