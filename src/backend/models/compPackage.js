const compPackage = (sequelize, DataTypes) => {
  const CompPackage = sequelize.define("compPackage", {
    ARV: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  CompPackage.associate = models => {
    CompPackage.hasMany(models.Comp, { onDelete: "CASCADE" });
    CompPackage.hasOne(models.DealWizard, {
      onDelete: "CASCADE"
    });
  };

  return CompPackage;
};

export default compPackage;
