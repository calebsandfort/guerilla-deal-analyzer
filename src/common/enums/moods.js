import * as enumUtilities from "./utilities";

export const moods = {
  ACTIVE: {
    value: 0,
    display: "Active"
  },
  INGORE: {
    value: 1,
    display: "Ignore"
  },
  EXPLORE: {
    value: 2,
    display: "Explore"
  }
};

export const array = () => {
  return enumUtilities.getAsArray(moods);
};

export const filteredArray = values => {
  return enumUtilities.getAsArrayForValues(moods, values);
};

export const valueArray = () => {
  return enumUtilities.getAsValueArray(moods);
};

export const displayArray = () => {
  return enumUtilities.getAsDisplayArray(moods);
};

export const findByValue = value => {
  return enumUtilities.findByValue(moods, value);
};

export const getDisplayForValue = value => {
  return enumUtilities.getDisplayForValue(moods, value);
};
