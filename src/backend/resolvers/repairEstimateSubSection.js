import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";

export default {
  Query: {
    repairEstimateSubSections: async (
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

      return await models.RepairEstimateSubSection.findAll(params);
    },
    repairEstimateSubSectionsQueryable: async (
      parent,
      { query },
      { models }
    ) => {
      const params = entityQuery.entityQueryToSequelize(query);
      return await models.RepairEstimateSubSection.findAll(params);
    },
    repairEstimateSubSection: async (parent, { id }, { models }) => {
      return await models.RepairEstimateSubSection.findByPk(id);
    }
  },

  Mutation: {
    createRepairEstimateSubSection: async (parent, { input }, { models }) => {
      return await models.RepairEstimateSubSection.create(input);
    },

    updateRepairEstimateSubSection: async (
      parent,
      { id, input },
      { models }
    ) => {
      const repairEstimateSubSection = await models.RepairEstimateSubSection.findByPk(
        id
      );
      return await repairEstimateSubSection.update(input);
    },

    deleteRepairEstimateSubSection: async (parent, { id }, { models }) => {
      return await models.RepairEstimateSubSection.destroy({
        where: { id }
      });
    }
  },

  RepairEstimateSubSection: {
    lineItems: async (repairEstimateSubSection, args, { models }) => {
      return await models.RepairEstimateLineItem.findAll({
        where: {
          repairEstimateSubSectionId: repairEstimateSubSection.id
        }
      });
    }
  }
};
