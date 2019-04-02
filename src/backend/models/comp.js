const comp = (sequelize, DataTypes) => {
  const Comp = sequelize.define("comp", {});

  Comp.associate = models => {
    Comp.belongsTo(models.Property, { onDelete: "CASCADE" });
  };

  return Comp;
};

export default comp;
