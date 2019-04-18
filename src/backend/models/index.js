import Sequelize from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DATABASE_HOST,
    logging: false
  }
);

const models = {
  Property: sequelize.import("./property"),
  Comp: sequelize.import("./comp"),
  CompPackage: sequelize.import("./compPackage"),
  DealAnalysis: sequelize.import("./dealAnalysis")
};

Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
