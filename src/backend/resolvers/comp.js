import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";

export default {
  Query: {
    comps: async (
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

      return await models.Comp.findAll(params);
    },
    compsQueryable: async (parent, { query }, { models }) => {
      const params = entityQuery.entityQueryToSequelize(query);
      return await models.Comp.findAll(params);
    },
    comp: async (parent, { id }, { models }) => {
      return await models.Comp.findByPk(id);
    }
  },

  Mutation: {
    createComp: async (parent, { input }, { models }) => {
      return await models.Comp.create(input);
    },

    updateComp: async (parent, { id, input }, { models }) => {
      const comp = await models.Comp.findByPk(id);
      return await comp.update(input);
    },

    deleteComp: async (parent, { id }, { models }) => {
      return await models.Comp.destroy({
        where: { id }
      });
    }
  },

  Comp: {
    property: async (comp, args, { models }) => {
      return await models.Property.findByPk(comp.propertyId);
    }
  }
};
