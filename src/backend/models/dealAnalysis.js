const dealAnalysis = (sequelize, DataTypes) => {
  const DealAnalysis = sequelize.define("dealAnalysis", {});

  DealAnalysis.associate = models => {};

  return DealAnalysis;
};

export default dealAnalysis;
