import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";
import * as zillowScraper from "../services/scrape/zillow-scraper";
import _ from "lodash";
import moment from "moment";
import * as moods from "../../common/enums/moods";

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
      return await models.Property.findById(id);
    },
    findProperty: async (parent, { term }, { models }) => {
      let property = await models.Property.findOne({
        where: { zillow_path: term }
      });
      if (property == null) {
        const scrapedProperty = await zillowScraper.findProperty(term);
        if (scrapedProperty) {
          property = await models.Property.create(scrapedProperty);
        } else {
          return null;
        }
      }

      return property;
    },
    findProperties: async (parent, { terms }, { models }) => {
      const properties = [];

      for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        let property = await models.Property.findOne({
          where: { zillow_path: term }
        });
        if (property == null) {
          const scrapedProperty = await zillowScraper.findProperty(term);
          if (scrapedProperty) {
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
      const property = await models.Property.findById(id);
      return await property.update(input);
    },

    expandoPropertyUpdate: async (parent, { id, input }, { models }) => {
      const property = await models.Property.findById(id);
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
    keywords: (property, { search_keywords }, { models }) => {
      const lowerCaseDescription = property.description.toLowerCase();
      return _.filter(search_keywords, function(skw) {
        return lowerCaseDescription.indexOf(skw.toLowerCase()) > -1;
      });
    },
    keywords_count: (property, { search_keywords }, { models }) => {
      const lowerCaseDescription = property.description.toLowerCase();
      return _.filter(search_keywords, function(skw) {
        return lowerCaseDescription.indexOf(skw.toLowerCase()) > -1;
      }).length;
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
    mood_display: property => {
      return moods.getDisplayForValue(property.mood);
    }
  }
};
