import * as enumUtilities from "./utilities";

export const statuses = {
  NEW: {
    value: 0,
    display: "New"
  },
  ACTIVE: {
    value: 1,
    display: "Active"
  },
  INGORE: {
    value: 2,
    display: "Ignore"
  },
  EXPLORE: {
    value: 3,
    display: "Explore"
  },
  TARGET: {
    value: 4,
    display: "Target"
  },
  COMP: {
    value: 5,
    display: "Comp"
  },
  DIRECT_MAIL: {
    value: 6,
    display: "Direct Mail"
  }
};

export const array = () => {
  return enumUtilities.getAsArray(statuses);
};

export const filteredArray = values => {
  return enumUtilities.getAsArrayForValues(statuses, values);
};

export const valueArray = () => {
  return enumUtilities.getAsValueArray(statuses);
};

export const displayArray = () => {
  return enumUtilities.getAsDisplayArray(statuses);
};

export const findByValue = value => {
  return enumUtilities.findByValue(statuses, value);
};

export const getDisplayForValue = value => {
  return enumUtilities.getDisplayForValue(statuses, value);
};
