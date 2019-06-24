const repairEstimateSubSection = (sequelize, DataTypes) => {
  const RepairEstimateSubSection = sequelize.define("repairEstimateSubSection", {
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

  RepairEstimateSubSection.associate = models => {
    RepairEstimateSubSection.belongsTo(models.RepairEstimateSection, {
      onDelete: "CASCADE"
    });
  };

  return RepairEstimateSubSection;
};

export default repairEstimateSubSection;
