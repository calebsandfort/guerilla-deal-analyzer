import _ from "lodash";
import algebra from "algebra.js";
import * as loanTypes from "../enums/loanTypes";
import * as math from "mathjs";

const Fraction = algebra.Fraction;
const Expression = algebra.Expression;
const Equation = algebra.Equation;

const percentFields = [
  "SNAP_ROI",
  "BTC_TitleInsuranceSearch",
  "FC_FirstMortgageAmount",
  "FC_FirstMortgageInterest",
  "FC_SecondMortgageAmount",
  "FC_SecondMortgageInterest",
  "FC_MiscMortgageAmount",
  "FC_MiscMortgageInterest",
  "STC_RealtorFees",
  "STC_TransferConveyenceFees"
];

export default class DealAnalysisProxy {
  dealAnalysis = null;
  exprValues = null;

  constructor(dealAnalysis) {
    this.dealAnalysis = dealAnalysis;
  }

  //region Expressions
  //region Buying Transaction Costs
  get BTC_TitleInsuranceSearch_CostExpr() {
    return new Expression("DF_PurchasePrice").multiply("BTC_TitleInsuranceSearch");
  }

  // prettier-ignore
  get BTC_TotalCostExpr() {
    return this.BTC_TitleInsuranceSearch_CostExpr.add("BTC_EscrowAttorney").add("BTC_Misc");
  }
  //endregion

  //region Holding Costs
  get HC_PropertyTaxesMonthlyExpr() {
    return new Expression("HC_PropertyTaxesAnnually").divide(12);
  }

  get HC_InsuranceMonthlyExpr() {
    return new Expression("HC_InsuranceAnnually").divide(12);
  }

  // prettier-ignore
  get HC_UtilitiesMonthlyExpr() {
    return new Expression("HC_Gas").add("HC_Water").add("HC_Electricity").add("HC_OtherUtilities");
  }

  // prettier-ignore
  get HC_TotalCostMonthlyExpr() {
    return new Expression("HC_MiscMonthly").add("HC_HOAMonthly").add(this.HC_PropertyTaxesMonthlyExpr).add(this.HC_InsuranceMonthlyExpr).add(this.HC_UtilitiesMonthlyExpr);
  }

  // prettier-ignore
  get HC_TotalCostExpr() {
    return new Expression("DF_HoldTime").multiply(this.HC_TotalCostMonthlyExpr);
  }
  //endregion

  //region Financing Costs

  // prettier-ignore
  get FC_LoanAmountExpr() {
    switch (this.dealAnalysis.FC_LoanType) {
      case loanTypes.loanTypes.ARV.value:
        return new Expression("DF_ARV");
      case loanTypes.loanTypes.PURCHASE_PRICE.value:
        return new Expression("DF_PurchasePrice");
      case loanTypes.loanTypes.PURCHASE_PLUS_REHAB.value:
        return new Expression("DF_PurchasePrice").add("DF_RepairCosts");
    }

    return new Expression("DF_PurchasePrice");
  }

  //region First Mortgage
  get FC_FirstMortgageAmount_CostExpr() {
    return this.FC_LoanAmountExpr.multiply("FC_FirstMortgageAmount");
  }

  get FC_FirstMortgagePoints_CostExpr() {
    return this.FC_FirstMortgageAmount_CostExpr.multiply("FC_FirstMortgagePoints").divide(100);
  }

  get FC_FirstMortgageInterest_CostExpr() {
    return this.FC_FirstMortgageAmount_CostExpr.multiply("FC_FirstMortgageInterest")
      .multiply("DF_HoldTime")
      .divide(12);
  }

  get FC_FirstMortgagePaymentExpr() {
    return this.FC_FirstMortgageInterest_CostExpr.multiply("DF_HoldTimeFraction");
  }
  //endregion

  //region Second Mortgage
  get FC_SecondMortgageAmount_CostExpr() {
    return this.FC_LoanAmountExpr.multiply("FC_SecondMortgageAmount");
  }

  get FC_SecondMortgagePoints_CostExpr() {
    return this.FC_SecondMortgageAmount_CostExpr.multiply("FC_SecondMortgagePoints").divide(100);
  }

  get FC_SecondMortgageInterest_CostExpr() {
    return this.FC_SecondMortgageAmount_CostExpr.multiply("FC_SecondMortgageInterest")
      .multiply("DF_HoldTime")
      .divide(12);
  }

  get FC_SecondMortgagePaymentExpr() {
    return this.FC_SecondMortgageInterest_CostExpr.multiply("DF_HoldTimeFraction");
  }
  //endregion

  //region Misc Mortgage
  get FC_MiscMortgageAmount_CostExpr() {
    return this.FC_LoanAmountExpr.multiply("FC_MiscMortgageAmount");
  }

  get FC_MiscMortgagePoints_CostExpr() {
    return this.FC_MiscMortgageAmount_CostExpr.multiply("FC_MiscMortgagePoints").divide(100);
  }

  get FC_MiscMortgageInterest_CostExpr() {
    return this.FC_MiscMortgageAmount_CostExpr.multiply("FC_MiscMortgageInterest")
      .multiply("DF_HoldTime")
      .divide(12);
  }

  get FC_MiscMortgagePaymentExpr() {
    return this.FC_MiscMortgageInterest_CostExpr.multiply("DF_HoldTimeFraction");
  }
  //endregion

  // prettier-ignore
  get FC_TotalCostExpr() {
    return this.FC_FirstMortgagePoints_CostExpr.add(this.FC_FirstMortgageInterest_CostExpr)
      .add(this.FC_SecondMortgagePoints_CostExpr).add(this.FC_SecondMortgageInterest_CostExpr)
      .add(this.FC_MiscMortgagePoints_CostExpr).add(this.FC_MiscMortgageInterest_CostExpr)
      .add("FC_MiscCost");
  }
  //endregion

  //region Selling Transaction Costs
  get STC_RealtorFees_CostExpr() {
    return new Expression("DF_ARV").multiply("STC_RealtorFees");
  }

  get STC_TransferConveyenceFees_CostExpr() {
    return new Expression("DF_ARV").multiply("STC_TransferConveyenceFees");
  }

  // prettier-ignore
  get STC_TotalCostExpr() {
    return this.STC_RealtorFees_CostExpr.add(this.STC_TransferConveyenceFees_CostExpr)
      .add("STC_Misc").add("STC_Staging")
      .add("STC_EscrowAttorney").add("STC_SellingRecording")
      .add("STC_HomeWarranty").add("STC_Marketing");
  }
  //endregion

  //region SNAP
  // prettier-ignore
  get SNAP_TotalCostExpr() {
    return this.FC_TotalCostExpr
      .add(this.BTC_TotalCostExpr)
      .add(this.HC_TotalCostExpr)
      .add(this.STC_TotalCostExpr)
      .add("DF_PurchasePrice")
      .add("DF_RepairCosts");
  }

  // prettier-ignore
  get SNAP_ProfitExpr() {
    return new Expression("DF_ARV").subtract(this.SNAP_TotalCostExpr);
  }

  get SNAP_ROIExpr() {
    return new Expression("SNAP_ROI");
  }

  get SNAP_ROIEq() {
    return new Equation(this.SNAP_ProfitExpr, this.SNAP_ROIExpr.multiply(this.SNAP_TotalCostExpr));
  }

  get DF_PurchasePriceExpr() {
    let expr = this.SNAP_ROIEq.solveFor("DF_PurchasePrice");
    return expr;
  }

  findPurchasePrice() {
    let min = 0;
    let max = 0;
    let proposedPrice = 0;
    let heuristicROI = 0;
    let counter = 0;

    do {
      if (proposedPrice == 0) {
        proposedPrice = this.dealAnalysis.DF_Ask;
      } else if (min > 0 && max > 0) {
        if (heuristicROI < this.dealAnalysis.SNAP_ROI) {
          max = proposedPrice;
        } else if (heuristicROI > this.dealAnalysis.SNAP_ROI) {
          min = proposedPrice;
        }

        proposedPrice = math
          .chain(min + (max - min) / 2)
          .toFloat(2)
          .done();
      } else if (heuristicROI < this.dealAnalysis.SNAP_ROI) {
        max = proposedPrice;
        proposedPrice = math
          .chain(proposedPrice)
          .divide(2)
          .toFloat(2)
          .done();
      } else if (heuristicROI > this.dealAnalysis.SNAP_ROI) {
        min = proposedPrice;
        proposedPrice = math
          .chain(proposedPrice)
          .multiply(2)
          .toFloat(2)
          .done();
      }

      this.dealAnalysis.DF_PurchasePrice = proposedPrice;
      this.exprValues.DF_PurchasePrice = new Fraction(Math.floor(this.dealAnalysis.DF_PurchasePrice * 100), 100);

      this.evalExpr("SNAP_Profit");
      this.evalExpr("SNAP_TotalCost");

      heuristicROI = math
        .chain(this.dealAnalysis.SNAP_Profit)
        .divide(this.dealAnalysis.SNAP_TotalCost)
        .toFloat(4)
        .done();

      counter += 1;
    } while (this.dealAnalysis.SNAP_ROI != heuristicROI && counter < 50);
  }
  //endregion

  //region Misc
  getExprValues() {
    return this.exprValues;
  }

  // prettier-ignore
  setExprValues(includePurchasePrice = true) {
    this.exprValues = {
      DF_ARV: new Fraction(Math.floor(this.dealAnalysis.DF_ARV * 100), 100),
      DF_RepairCosts: new Fraction(Math.floor(this.dealAnalysis.DF_RepairCosts * 100), 100),
      DF_HoldTime: new Fraction(this.dealAnalysis.DF_HoldTime, 1),
      DF_HoldTimeFraction: new Fraction(1, this.dealAnalysis.DF_HoldTime),

      FC_FirstMortgageAmount: new Fraction(Math.floor(this.dealAnalysis.FC_FirstMortgageAmount * 10000), 10000),
      FC_FirstMortgagePoints: new Fraction(Math.floor(this.dealAnalysis.FC_FirstMortgagePoints * 100), 100),
      FC_FirstMortgageInterest: new Fraction(Math.floor(this.dealAnalysis.FC_FirstMortgageInterest * 10000), 10000),
      FC_SecondMortgageAmount: new Fraction(Math.floor(this.dealAnalysis.FC_SecondMortgageAmount * 10000), 10000),
      FC_SecondMortgagePoints: new Fraction(Math.floor(this.dealAnalysis.FC_SecondMortgagePoints * 100), 100),
      FC_SecondMortgageInterest: new Fraction(Math.floor(this.dealAnalysis.FC_SecondMortgageInterest * 10000), 10000),
      FC_MiscMortgageAmount: new Fraction(Math.floor(this.dealAnalysis.FC_MiscMortgageAmount * 10000), 10000),
      FC_MiscMortgagePoints: new Fraction(Math.floor(this.dealAnalysis.FC_MiscMortgagePoints * 100), 100),
      FC_MiscMortgageInterest: new Fraction(Math.floor(this.dealAnalysis.FC_MiscMortgageInterest * 10000), 10000),
      FC_MiscCost: new Fraction(Math.floor(this.dealAnalysis.FC_MiscCost * 100), 100),

      BTC_EscrowAttorney: new Fraction(Math.floor(this.dealAnalysis.BTC_EscrowAttorney * 100), 100),
      BTC_TitleInsuranceSearch: new Fraction(Math.floor(this.dealAnalysis.BTC_TitleInsuranceSearch * 10000), 10000),
      BTC_Misc: new Fraction(Math.floor(this.dealAnalysis.BTC_Misc * 100), 100),

      HC_PropertyTaxesAnnually: new Fraction(Math.floor(this.dealAnalysis.HC_PropertyTaxesAnnually * 100), 100),
      HC_InsuranceAnnually: new Fraction(Math.floor(this.dealAnalysis.HC_InsuranceAnnually * 100), 100),
      HC_HOAMonthly: new Fraction(Math.floor(this.dealAnalysis.HC_HOAMonthly * 100), 100),
      HC_Gas: new Fraction(Math.floor(this.dealAnalysis.HC_Gas * 100), 100),
      HC_Water: new Fraction(Math.floor(this.dealAnalysis.HC_Water * 100), 100),
      HC_Electricity: new Fraction(Math.floor(this.dealAnalysis.HC_Electricity * 100), 100),
      HC_OtherUtilities: new Fraction(Math.floor(this.dealAnalysis.HC_OtherUtilities * 100), 100),
      HC_MiscMonthly: new Fraction(Math.floor(this.dealAnalysis.HC_MiscMonthly * 100), 100),

      STC_RealtorFees: new Fraction(Math.floor(this.dealAnalysis.STC_RealtorFees * 10000), 10000),
      STC_TransferConveyenceFees: new Fraction(Math.floor(this.dealAnalysis.STC_TransferConveyenceFees * 10000), 10000),
      STC_Misc: new Fraction(Math.floor(this.dealAnalysis.STC_Misc * 100), 100),
      STC_Staging: new Fraction(Math.floor(this.dealAnalysis.STC_Staging * 100), 100),
      STC_EscrowAttorney: new Fraction(Math.floor(this.dealAnalysis.STC_EscrowAttorney * 100), 100),
      STC_SellingRecording: new Fraction(Math.floor(this.dealAnalysis.STC_SellingRecording * 100), 100),
      STC_HomeWarranty: new Fraction(Math.floor(this.dealAnalysis.STC_HomeWarranty * 100), 100),
      STC_Marketing: new Fraction(Math.floor(this.dealAnalysis.STC_Marketing * 100), 100)
    };

    // if(includePurchasePrice){
    //   this.exprValues.DF_PurchasePrice = new Fraction(this.dealAnalysis.DF_PurchasePrice * 100, 100);
    // }
  }
  //endregion
  //endregion

  //region Functions
  setField(pairs) {
    let fieldUpdated = false;
    const keys = _.keys(this.dealAnalysis);

    for (let i = 0; i < pairs.length; i++) {
      if (keys.indexOf(pairs[i].field) > -1) {
        if (percentFields.indexOf(pairs[i].field) > -1) {
          pairs[i].val /= 100;
        }
        _.set(this.dealAnalysis, pairs[i].field, pairs[i].val);
        fieldUpdated = true;
      }
    }

    if (fieldUpdated) {
      this.setExprValues();

      this.findPurchasePrice();

      //region Financing Costs
      this.evalExpr("FC_LoanAmount");
      this.evalExpr("FC_FirstMortgageAmount_Cost");
      this.evalExpr("FC_FirstMortgagePoints_Cost");
      this.evalExpr("FC_FirstMortgageInterest_Cost");
      this.evalExpr("FC_FirstMortgagePayment");
      this.evalExpr("FC_SecondMortgageAmount_Cost");
      this.evalExpr("FC_SecondMortgagePoints_Cost");
      this.evalExpr("FC_SecondMortgageInterest_Cost");
      this.evalExpr("FC_SecondMortgagePayment");
      this.evalExpr("FC_MiscMortgageAmount_Cost");
      this.evalExpr("FC_MiscMortgagePoints_Cost");
      this.evalExpr("FC_MiscMortgageInterest_Cost");
      this.evalExpr("FC_MiscMortgagePayment");
      this.evalExpr("FC_TotalCost");
      //endregion

      //region Buying Transaction Costs
      this.evalExpr("BTC_TitleInsuranceSearch_Cost");
      this.evalExpr("BTC_TotalCost");
      //endregion

      //region Holding Costs
      this.evalExpr("HC_PropertyTaxesMonthly");
      this.evalExpr("HC_InsuranceMonthly");
      this.evalExpr("HC_UtilitiesMonthly");
      this.evalExpr("HC_TotalCostMonthly");
      this.evalExpr("HC_TotalCost");
      //endregion

      //region Selling Transaction Costs
      this.evalExpr("STC_RealtorFees_Cost");
      this.evalExpr("STC_TransferConveyenceFees_Cost");
      this.evalExpr("STC_TotalCost");
      //endregion

      //region SNAP
      this.evalExpr("SNAP_TotalCost");
      this.evalExpr("SNAP_Profit");
      //endregion
    }

    return fieldUpdated;
  }

  evalExpr(field, precision = 2) {
    const expr = this[`${field}Expr`].eval(this.getExprValues());
    _.set(
      this.dealAnalysis,
      field,
      math
        .chain(math.eval(expr.toString()))
        .toFloat(precision)
        .done()
    );
  }

  updateForProperty(property) {
    this.setField([
      {
        field: "DF_Ask",
        val: property.price
      },
      {
        field: "DF_ARV",
        val: property.zestimate > 0 ? property.zestimate : property.price
      },
      {
        field: "HC_PropertyTaxesAnnually",
        val: property.propertyTaxesAnnually
      },
      {
        field: "HC_InsuranceAnnually",
        val: property.insuranceAnnually
      }
    ]);
  }
  //endregion
}
