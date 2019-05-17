import * as enumUtilities from "./utilities";

export const dealAnalysisSectionTypes = {
  NONE: {
    value: 0,
    display: "None"
  },
  FINANCING_COSTS: {
    value: 1,
    display: "Financing Costs"
  },
  BUYING_COSTS: {
    value: 2,
    display: "Buying Transaction Costs"
  },
  HOLDING_COSTS: {
    value: 3,
    display: "Holding Costs"
  },
  SELLING_COSTS: {
    value: 4,
    display: "Selling Transaction Costs"
  }
};

export const array = () => {
  return enumUtilities.getAsArray(dealAnalysisSectionTypes);
};

export const filteredArray = values => {
  return enumUtilities.getAsArrayForValues(dealAnalysisSectionTypes, values);
};

export const valueArray = () => {
  return enumUtilities.getAsValueArray(dealAnalysisSectionTypes);
};

export const displayArray = () => {
  return enumUtilities.getAsDisplayArray(dealAnalysisSectionTypes);
};

export const findByValue = value => {
  return enumUtilities.findByValue(dealAnalysisSectionTypes, value);
};

export const getDisplayForValue = value => {
  return enumUtilities.getDisplayForValue(dealAnalysisSectionTypes, value);
};
