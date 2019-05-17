const dealWizard = (sequelize, DataTypes) => {
  const DealWizard = sequelize.define("dealWizard", {});

  DealWizard.associate = models => {};

  return DealWizard;
};

export default dealWizard;
