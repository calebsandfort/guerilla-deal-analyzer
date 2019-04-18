import * as enumUtilities from "./utilities";

export const engagements = {
  NONE: {
    value: 0,
    display: "None"
  },
  HOVER: {
    value: 1,
    display: "Hover"
  },
  SPOTLIGHT: {
    value: 2,
    display: "Spotlight"
  },
  ANALYSIS: {
    value: 3,
    display: "Anaylsis"
  }
};

export const array = () => {
  return enumUtilities.getAsArray(engagements);
};

export const filteredArray = values => {
  return enumUtilities.getAsArrayForValues(engagements, values);
};

export const valueArray = () => {
  return enumUtilities.getAsValueArray(engagements);
};

export const displayArray = () => {
  return enumUtilities.getAsDisplayArray(engagements);
};

export const findByValue = value => {
  return enumUtilities.findByValue(engagements, value);
};

export const getDisplayForValue = value => {
  return enumUtilities.getDisplayForValue(engagements, value);
};

export const getMarkerColor = value => {
  let color = "green";

  switch (value) {
    case engagements.HOVER.value:
      color = "yellow";
      break;
    case engagements.SPOTLIGHT.value:
      color = "blue";
      break;
    case engagements.ANALYSIS.value:
      color = "red";
      break;
  }

  return color;
};
