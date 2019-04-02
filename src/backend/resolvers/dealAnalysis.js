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

      if (dealAnalysis.compPackage != null) {
        input.compPackage.dealAnalysisId = dealAnalysisId;
        dealAnalysis.compPackage = await models.CompPackage.create(
          input.compPackage
        );

        const collectionPromises = [];

        if (
          typeof input.compPackage.comps != "undefined" &&
          input.compPackage.comps.length > 0
        ) {
          input.compPackage.comps.forEach(function(comp) {
            comp.compPackageId = dealAnalysis.compPackage.id;
            collectionPromises.push(models.Comp.create(comp));
          });
        }

        if (collectionPromises.length > 0) {
          input.compPackage.comps = await Promise.all(collectionPromises);
        }
      }

      return dealAnalysis;
    },

    updateDealAnalysis: async (parent, { id, input }, { models }) => {
      const dealAnalysis = await models.DealAnalysis.findById(id);
      return await dealAnalysis.update(input);
    },

    deleteDealAnalysis: async (parent, { id }, { models }) => {
      return await models.DealAnalysis.destroy({
        where: { id }
      });
    }
  },

  DealAnalysis: {
    compPackage: async (dealAnalysis, args, { models }) => {
      return await models.CompPackage.findOne({
        where: {
          dealAnalysisId: dealAnalysis.id
        }
      });
    }
  }
};
