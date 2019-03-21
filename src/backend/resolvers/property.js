import Sequelize from 'sequelize';
import * as entityQuery from '../utilities/entityQuery';
import * as zillowScraper from "../services/scrape/zillow-scraper";

export default {
  Query: {
    properties: async (parent, { offset = 0, limit = 0, order =  'id DESC'}, { models }) => {
      const params = {};

      if(limit > 0){
        params.offset = offset;
        params.limit = limit;
      }

      if(order != ''){
        params.order = Sequelize.literal(order);
      }

      return await models.Property.findAll(params);
    },
    propertiesQueryable: async (parent, {query}, { models }) => {
      const params = entityQuery.entityQueryToSequelize(query);
      return await models.Property.findAll(params);
    },
    property: async (parent, { id }, { models }) => {
      return await models.Property.findById(id);
    },
    findProperty: async (parent, { term }, { models }) => {
      return await zillowScraper.findProperty(term);
    },
    findProperties: async (parent, { terms }, { models }) => {
      return await zillowScraper.findProperties(terms);
    },
  },

  Mutation: {
    createProperty: async (
      parent,
      { input },
      { models },
    ) => {
      const property = await models.Property.create(input);

      const collectionPromises = []

      return property;
    },

    updateProperty: async (parent, { id, input }, { models }) => {
      const property = await models.Property.findById(id);
      return await property.update(input);
    },

    deleteProperty: async (parent, { id }, { models }) => {
      return await models.Property.destroy({
        where: { id },
      });
    },
  },

  Property: {

  },
};