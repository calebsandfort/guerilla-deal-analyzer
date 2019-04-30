import * as enumUtilities from "./utilities";

export const unitTypes = {
  NONE: {
    value: 0,
    display: "None"
  },
  SQUARE_FEET: {
    value: 1,
    display: "sqft"
  },
  EACH: {
    value: 2,
    display: "each"
  },
  LINEAR_FEET: {
    value: 3,
    display: "lf"
  },
  LUMP_SUM: {
    value: 4,
    display: "ls"
  },
  SQUARE_YARDS: {
    value: 5,
    display: "sqyd"
  }
};

export const array = () => {
  return enumUtilities.getAsArray(unitTypes);
};

export const filteredArray = values => {
  return enumUtilities.getAsArrayForValues(unitTypes, values);
};

export const valueArray = () => {
  return enumUtilities.getAsValueArray(unitTypes);
};

export const displayArray = () => {
  return enumUtilities.getAsDisplayArray(unitTypes);
};

export const findByValue = value => {
  return enumUtilities.findByValue(unitTypes, value);
};

export const getDisplayForValue = value => {
  return enumUtilities.getDisplayForValue(unitTypes, value);
};
