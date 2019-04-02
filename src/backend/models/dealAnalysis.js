const dealAnalysis = (sequelize, DataTypes) => {
  const DealAnalysis = sequelize.define("dealAnalysis", {});

  DealAnalysis.associate = models => {
    DealAnalysis.hasOne(models.CompPackage, { onDelete: "CASCADE" });
  };

  return DealAnalysis;
};

export default dealAnalysis;
