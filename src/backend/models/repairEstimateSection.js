const repairEstimateSection = (sequelize, DataTypes) => {
  const RepairEstimateSection = sequelize.define("repairEstimateSection", {
    selected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    totalCost: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    },
    sectionType: {
      type: DataTypes.INTEGER,
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
