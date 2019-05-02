import * as enumUtilities from "./utilities";

export const repairEstimateSectionTypes = {
  NONE: {
    value: 0,
    display: "None"
  },
  EXTERIOR: {
    value: 1,
    display: "Exterior"
  },
  INTERIOR: {
    value: 2,
    display: "Interior"
  },
  MECHANICALS: {
    value: 3,
    display: "Mechanicals"
  },
  OTHER: {
    value: 4,
    display: "Other"
  }
};

export const array = () => {
  return enumUtilities.getAsArray(repairEstimateSectionTypes);
};

export const filteredArray = values => {
  return enumUtilities.getAsArrayForValues(repairEstimateSectionTypes, values);
};

export const valueArray = () => {
  return enumUtilities.getAsValueArray(repairEstimateSectionTypes);
};

export const displayArray = () => {
  return enumUtilities.getAsDisplayArray(repairEstimateSectionTypes);
};

export const findByValue = value => {
  return enumUtilities.findByValue(repairEstimateSectionTypes, value);
};

export const getDisplayForValue = value => {
  return enumUtilities.getDisplayForValue(repairEstimateSectionTypes, value);
};
