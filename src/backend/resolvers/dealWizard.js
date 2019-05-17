import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";

export default {
  Query: {
    dealWizards: async (
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

      return await models.DealWizard.findAll(params);
    },
    dealWizardsQueryable: async (parent, { query }, { models }) => {
      const params = entityQuery.entityQueryToSequelize(query);
      return await models.DealWizard.findAll(params);
    },
    dealWizard: async (parent, { id }, { models }) => {
      return await models.DealWizard.findByPk(id);
    }
  },

  Mutation: {
    createDealWizard: async (parent, { input }, { models }) => {
      const dealWizard = await models.DealWizard.create(input);

      // if (dealWizard.compPackage != null) {
      //   input.compPackage.dealWizardId = dealWizardId;
      //   dealWizard.compPackage = await models.CompPackage.create(
      //     input.compPackage
      //   );
      //
      //   const collectionPromises = [];
      //
      //   if (
      //     typeof input.compPackage.comps != "undefined" &&
      //     input.compPackage.comps.length > 0
      //   ) {
      //     input.compPackage.comps.forEach(function(comp) {
      //       comp.compPackageId = dealWizard.compPackage.id;
      //       collectionPromises.push(models.Comp.create(comp));
      //     });
      //   }
      //
      //   if (collectionPromises.length > 0) {
      //     input.compPackage.comps = await Promise.all(collectionPromises);
      //   }
      // }

      return dealWizard;
    },

    updateDealWizard: async (parent, { id, input }, { models }) => {
      const dealWizard = await models.DealWizard.findByPk(id);
      return await dealWizard.update(input);
    },

    deleteDealWizard: async (parent, { id }, { models }) => {
      return await models.DealWizard.destroy({
        where: { id }
      });
    }
  },

  DealWizard: {
    compPackage: async (dealWizard, args, { models }) => {
      return await models.CompPackage.findByPk(dealWizard.compPackageId);
    },
    repairEstimate: async (dealWizard, args, { models }) => {
      return await models.RepairEstimate.findByPk(dealWizard.repairEstimateId);
    },
    dealAnalysis: async (dealWizard, args, { models }) => {
      return await models.DealAnalysis.findByPk(dealWizard.dealAnalysisId);
    }
  }
};
