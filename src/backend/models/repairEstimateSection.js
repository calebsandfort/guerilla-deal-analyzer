const repairEstimateSection = (sequelize, DataTypes) => {
  const RepairEstimateSection = sequelize.define("repairEstimateSection", {
    selected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      length: 100,
      defaultValue: ""
    },
    totalCost: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    }
  });

  RepairEstimateSection.associate = models => {
    RepairEstimateSection.belongsTo(models.RepairEstimate, {
      onDelete: "CASCADE"
    });
  };

  return RepairEstimateSection;
};

export default repairEstimateSection;
