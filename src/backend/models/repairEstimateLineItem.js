const repairEstimateLineItem = (sequelize, DataTypes) => {
  const RepairEstimateLineItem = sequelize.define("repairEstimateLineItem", {
    selected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      length: 100,
      defaultValue: ""
    },
    quantity: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    },
    unit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    unitCost: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    },
    totalCost: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false
    }
  });

  RepairEstimateLineItem.associate = models => {
    RepairEstimateLineItem.belongsTo(models.RepairEstimateSubSection, {
      onDelete: "CASCADE"
    });
  };

  return RepairEstimateLineItem;
};

export default repairEstimateLineItem;
