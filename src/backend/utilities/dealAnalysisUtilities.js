import _ from "lodash";
import * as loanTypes from "../enums/loanTypes";
import * as math from "mathjs";

const rootFields = [
  "DF_ARV",
  "DF_Ask",
  "DF_RepairCosts",
  "DF_PurchasePrice",
  "DF_HoldTime",
  "FC_LoanType",
  "HC_PropertyTaxesAnnually",
  "HC_InsuranceAnnually",
  "HC_HOAMonthly",
  "HC_Gas",
  "HC_Water",
  "HC_Electricity",
  "HC_OtherUtilities",
  "HC_MiscMonthly"
];

function dealAnalysisProxy(dealAnalysis) {
  this.dealAnalysis = dealAnalysis;
}

//region Computed Properties
//region Financing Costs
dealAnalysisProxy.prototype.FC_LoanAmount = function() {
  switch (this.dealAnalysis.FC_LoanType) {
    case loanTypes.loanTypes.ARV.value:
      return this.dealAnalysis.DF_ARV;
    case loanTypes.loanTypes.PURCHASE_PRICE.value:
      return this.dealAnalysis.DF_PurchasePrice;
    case loanTypes.loanTypes.PURCHASE_PLUS_REHAB.value:
      return (
        this.dealAnalysis.DF_PurchasePrice + this.dealAnalysis.DF_RepairCosts
      );
  }

  return 0;
};
//endregion

//region Holding Costs
dealAnalysisProxy.prototype.HC_PropertyTaxesMonthly = function() {
  return this.dealAnalysis.HC_PropertyTaxesAnnually / 12;
};

dealAnalysisProxy.prototype.HC_InsuranceMonthly = function() {
  return this.dealAnalysis.HC_InsuranceAnnually / 12;
};

dealAnalysisProxy.prototype.HC_UtilitiesMonthly = function() {
  return math
    .chain(this.dealAnalysis.HC_Gas)
    .add(this.dealAnalysis.HC_Water)
    .add(this.dealAnalysis.HC_Electricity)
    .add(this.dealAnalysis.HC_OtherUtilities)
    .done();
};

dealAnalysisProxy.prototype.HC_TotalCostMonthly = function() {
  return math
    .chain(this.HC_UtilitiesMonthly())
    .add(this.HC_PropertyTaxesMonthly())
    .add(this.HC_InsuranceMonthly())
    .add(this.dealAnalysis.HC_MiscMonthly)
    .done();
};

dealAnalysisProxy.prototype.HC_TotalCost = function() {
  return math
    .chain(this.HC_TotalCostMonthly())
    .multiply(this.dealAnalysis.DF_HoldTime)
    .done();
};
//endregion

//endregion

//region Functions
dealAnalysisProxy.prototype.setField = function(pairs) {
  let fieldUpdated = false;

  for (let i = 0; i < pairs.length; i++) {
    if (rootFields.indexOf(pairs[i].field)) {
      _.set(this.dealAnalysis, pairs[i].field, pairs[i].val);
      fieldUpdated = true;
    }
  }

  if (fieldUpdated) {
    //region Financing Costs
    this.dealAnalysis.FC_LoanAmount = this.FC_LoanAmount();
    //endregion

    //region Holding Costs
    this.dealAnalysis.HC_PropertyTaxesMonthly = this.HC_PropertyTaxesMonthly();
    this.dealAnalysis.HC_InsuranceMonthly = this.HC_InsuranceMonthly();
    this.dealAnalysis.HC_UtilitiesMonthly = this.HC_UtilitiesMonthly();
    this.dealAnalysis.HC_TotalCostMonthly = this.HC_TotalCostMonthly();
    this.dealAnalysis.HC_TotalCost = this.HC_TotalCost();
    //endregion
  }

  return fieldUpdated;
};
//endregion

export default {
  dealAnalysisProxy
};
