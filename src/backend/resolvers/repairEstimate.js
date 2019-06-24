import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";

export default {
  Query: {
    repairEstimates: async (parent, { offset = 0, limit = 0, order = "idx ASC" }, { models }) => {
      const params = {};

      if (limit > 0) {
        params.offset = offset;
        params.limit = limit;
      }

      if (order != "") {
        params.order = Sequelize.literal(order);
      }

      return await models.RepairEstimate.findAll(params);
    },
    repairEstimatesQueryable: async (parent, { query }, { models }) => {
      const params = entityQuery.entityQueryToSequelize(query);
      return await models.RepairEstimate.findAll(params);
    },
    repairEstimate: async (parent, { id }, { models }) => {
      return await models.RepairEstimate.findByPk(id);
    }
  },

  Mutation: {
    createRepairEstimate: async (parent, { input }, { models }) => {
      return await models.RepairEstimate.create(input);
    },

    updateRepairEstimate: async (parent, { id, input }, { models }) => {
      const repairEstimate = await models.RepairEstimate.findByPk(id);
      return await repairEstimate.update(input);
    },

    deleteRepairEstimate: async (parent, { id }, { models }) => {
      return await models.RepairEstimate.destroy({
        where: { id }
      });
    }
  },

  RepairEstimate: {
    sections: async (repairEstimate, args, { models }) => {
      return await models.RepairEstimateLineItem.findAll({
        where: {
          repairEstimateId: repairEstimate.id
        }
      });
    }
  }
};
