import _ from "lodash";

export const getAsArray = enumObj => {
  return _.orderBy(
    _.map(_.keys(enumObj), function(key) {
      return enumObj[key];
    }),
    [
      function(item) {
        return item.value;
      }
    ],
    ["asc"]
  );
};

export const getAsArrayForValues = (enumObj, values) => {
  return _.filter(getAsArray(enumObj), function(item) {
    return values.includes(item.value);
  });
};

export const getAsValueArray = enumObj => {
  return _.orderBy(
    _.map(_.keys(enumObj), function(key) {
      return enumObj[key].value;
    }),
    [
      function(item) {
        return item;
      }
    ],
    ["asc"]
  );
};

export const getAsDisplayArray = enumObj => {
  return _.orderBy(
    _.map(_.keys(enumObj), function(key) {
      return enumObj[key].display;
    }),
    [
      function(item) {
        return item;
      }
    ],
    ["asc"]
  );
};

export const findByValue = (enumObj, value) => {
  return _.find(getAsArray(enumObj), function(item) {
    return value == item.value;
  });
};

export const getDisplayForValue = (enumObj, value) => {
  return _.find(getAsArray(enumObj), function(item) {
    return value == item.value;
  }).display;
};
