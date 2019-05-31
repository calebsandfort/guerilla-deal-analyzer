const dealAnalysis = (sequelize, DataTypes) => {
  const DealAnalysis = sequelize.define(
    "dealAnalysis",
    // prettier-ignore
    {
      DF_ARV: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      DF_Ask: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      DF_RepairCosts: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      DF_PurchasePrice: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      DF_HoldTime: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },

      PVP_TotalCost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },

      HC_PropertyTaxesAnnually: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_PropertyTaxesMonthly: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_InsuranceAnnually: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_InsuranceMonthly: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_HOAMonthly: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_Gas: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_Water: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_Electricity: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_OtherUtilities: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_UtilitiesMonthly: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_MiscMonthly: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_TotalCostMonthly: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      HC_TotalCost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },

      FC_LoanType: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },

      FC_LoanAmount: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_FirstMortgageAmount: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_FirstMortgagePoints: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_FirstMortgageInterest: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_FirstMortgageAmount_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_FirstMortgagePoints_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_FirstMortgageInterest_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_FirstMortgagePayment: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },

      FC_SecondMortgageAmount: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_SecondMortgagePoints: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_SecondMortgageInterest: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_SecondMortgageAmount_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_SecondMortgagePoints_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_SecondMortgageInterest_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_SecondMortgagePayment: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },

      FC_MiscMortgageAmount: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_MiscMortgagePoints: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_MiscMortgageInterest: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_MiscMortgageAmount_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_MiscMortgagePoints_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_MiscMortgageInterest_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_MiscMortgagePayment: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },

      FC_MiscCost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      FC_TotalCost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },

      BTC_TitleInsuranceSearch: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      BTC_TitleInsuranceSearch_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      BTC_EscrowAttorney: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      BTC_Misc: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      BTC_TotalCost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },

      STC_RealtorFees: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      STC_RealtorFees_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      STC_TransferConveyenceFees: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      STC_TransferConveyenceFees_Cost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      STC_Misc: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      STC_Staging: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      STC_EscrowAttorney: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      STC_SellingRecording: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      STC_HomeWarranty: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      STC_Marketing: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      STC_TotalCost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },

      SNAP_Profit: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      SNAP_ROI: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      SNAP_DownPayment: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      SNAP_CommittedCapital: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      SNAP_TotalCost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      SNAP_DiscountCost: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
      SNAP_DiscountPercent: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false }
    }
  );

  DealAnalysis.associate = models => {
    DealAnalysis.hasOne(models.DealWizard, {
      onDelete: "CASCADE"
    });
  };

  return DealAnalysis;
};

export default dealAnalysis;
