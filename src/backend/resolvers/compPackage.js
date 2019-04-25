import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";

export default {
  Query: {
    compPackages: async (
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

      return await models.CompPackage.findAll(params);
    },
    compPackagesQueryable: async (parent, { query }, { models }) => {
      const params = entityQuery.entityQueryToSequelize(query);
      return await models.CompPackage.findAll(params);
    },
    compPackage: async (parent, { id }, { models }) => {
      return await models.CompPackage.findByPk(id);
    }
  },

  Mutation: {
    createCompPackage: async (parent, { input }, { models }) => {
      const compPackage = await models.CompPackage.create(input);

      const collectionPromises = [];

      if (typeof input.comps != "undefined" && input.comps.length > 0) {
        input.comps.forEach(function(comp) {
          comp.compPackageId = compPackage.id;
          collectionPromises.push(models.Comp.create(comp));
        });
      }

      if (collectionPromises.length > 0) {
        await Promise.all(collectionPromises);
      }

      return compPackage;
    },

    updateCompPackage: async (parent, { id, input }, { models }) => {
      const compPackage = await models.CompPackage.findByPk(id);
      return await compPackage.update(input);
    },

    deleteCompPackage: async (parent, { id }, { models }) => {
      return await models.CompPackage.destroy({
        where: { id }
      });
    }
  },

  CompPackage: {
    comps: async (compPackage, args, { models }) => {
      return await models.Comp.findAll({
        where: {
          compPackageId: comp.id
        }
      });
    }
  }
};
