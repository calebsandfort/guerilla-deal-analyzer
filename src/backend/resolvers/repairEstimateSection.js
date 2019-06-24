import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";

export default {
  Query: {
    repairEstimateSections: async (parent, { offset = 0, limit = 0, order = "idx ASC" }, { models }) => {
      const params = {};

      if (limit > 0) {
        params.offset = offset;
        params.limit = limit;
      }

      if (order != "") {
        params.order = Sequelize.literal(order);
      }

      return await models.RepairEstimateSection.findAll(params);
    },
    repairEstimateSectionsQueryable: async (parent, { query }, { models }) => {
      const params = entityQuery.entityQueryToSequelize(query);
      return await models.RepairEstimateSection.findAll(params);
    },
    repairEstimateSection: async (parent, { id }, { models }) => {
      return await models.RepairEstimateSection.findByPk(id);
    }
  },

  Mutation: {
    createRepairEstimateSection: async (parent, { input }, { models }) => {
      return await models.RepairEstimateSection.create(input);
    },

    updateRepairEstimateSection: async (parent, { id, input }, { models }) => {
      const repairEstimateSection = await models.RepairEstimateSection.findByPk(id);
      return await repairEstimateSection.update(input);
    },

    deleteRepairEstimateSection: async (parent, { id }, { models }) => {
      return await models.RepairEstimateSection.destroy({
        where: { id }
      });
    }
  },

  RepairEstimateSection: {
    subSections: async (repairEstimateSection, args, { models }) => {
      return await models.RepairEstimateSubSection.findAll({
        where: {
          repairEstimateSubSectionId: repairEstimateSection.id
        }
      });
    }
  }
};
