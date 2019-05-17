import * as enumUtilities from "./utilities";

export const loanTypes = {
  NONE: {
    value: 0,
    display: "None"
  },
  ARV: {
    value: 1,
    display: "ARV"
  },
  PURCHASE_PLUS_REHAB: {
    value: 2,
    display: "Purchase + Rehab"
  },
  PURCHASE_PRICE: {
    value: 3,
    display: "Purchase Price"
  }
};

export const array = () => {
  return enumUtilities.getAsArray(loanTypes);
};

export const filteredArray = values => {
  return enumUtilities.getAsArrayForValues(loanTypes, values);
};

export const valueArray = () => {
  return enumUtilities.getAsValueArray(loanTypes);
};

export const displayArray = () => {
  return enumUtilities.getAsDisplayArray(loanTypes);
};

export const findByValue = value => {
  return enumUtilities.findByValue(loanTypes, value);
};

export const getDisplayForValue = value => {
  return enumUtilities.getDisplayForValue(loanTypes, value);
};
