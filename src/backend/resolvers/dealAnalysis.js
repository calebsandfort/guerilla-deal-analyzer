import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";

export default {
  Query: {
    dealAnalyses: async (
      parent,
      { offset = 0, limit = 0, order = "idx ASC" },
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

      return await models.DealAnalysis.findAll(params);
    },
    dealAnalysesQueryable: async (parent, { query }, { models }) => {
      const params = entityQuery.entityQueryToSequelize(query);
      return await models.DealAnalysis.findAll(params);
    },
    dealAnalysis: async (parent, { id }, { models }) => {
      return await models.DealAnalysis.findByPk(id);
    }
  },

  Mutation: {
    createDealAnalysis: async (parent, { input }, { models }) => {
      const dealAnalysis = await models.DealAnalysis.create(input);

      return dealAnalysis;
    },

    updateDealAnalysis: async (parent, { id, input }, { models }) => {
      const dealAnalysis = await models.DealAnalysis.findByPk(id);
      return await dealAnalysis.update(input);
    },

    deleteDealAnalysis: async (parent, { id }, { models }) => {
      return await models.DealAnalysis.destroy({
        where: { id }
      });
    }
  },

  DealAnalysis: {}
};
