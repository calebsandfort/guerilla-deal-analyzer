import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";

export default {
  Query: {
    repairEstimateLineItems: async (parent, { offset = 0, limit = 0, order = "idx ASC" }, { models }) => {
      const params = {};

      if (limit > 0) {
        params.offset = offset;
        params.limit = limit;
      }

      if (order != "") {
        params.order = Sequelize.literal(order);
      }

      return await models.RepairEstimateLineItem.findAll(params);
    },
    repairEstimateLineItemsQueryable: async (parent, { query }, { models }) => {
      const params = entityQuery.entityQueryToSequelize(query);
      return await models.RepairEstimateLineItem.findAll(params);
    },
    repairEstimateLineItem: async (parent, { id }, { models }) => {
      return await models.RepairEstimateLineItem.findByPk(id);
    }
  },

  Mutation: {
    createRepairEstimateLineItem: async (parent, { input }, { models }) => {
      return await models.RepairEstimateLineItem.create(input);
    },

    updateRepairEstimateLineItem: async (parent, { id, input }, { models }) => {
      const repairEstimateLineItem = await models.RepairEstimateLineItem.findById(id);
      return await repairEstimateLineItem.update(input);
    },

    deleteRepairEstimateLineItem: async (parent, { id }, { models }) => {
      return await models.RepairEstimateLineItem.destroy({
        where: { id }
      });
    }
  },

  RepairEstimateLineItem: {}
};
