const repairEstimate = (sequelize, DataTypes) => {
  const RepairEstimate = sequelize.define("repairEstimate", {
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
    },
    quick: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  });

  RepairEstimate.associate = models => {
    RepairEstimate.belongsTo(models.DealAnalysis, {
      onDelete: "CASCADE"
    });
  };

  return RepairEstimate;
};

export default repairEstimate;
