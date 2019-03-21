import Sequelize from 'sequelize';

export const entityQueryCtor = (isAndQuery = true, enablePaging = false, startRowIndex = 0, maximumRows = 0, sortExpression = '') => {
  return {
    isAndQuery,
    enablePaging,
    startRowIndex,
    maximumRows,
    sortExpression,
    searchFilters: []
  };
};

export const entityQueryToSequelize = (entityQuery) => {

  let params = {};

  if(entityQuery.enablePaging){
    params.offset = entityQuery.startRowIndex;
    params.limit = entityQuery.maximumRows;
  }

  if(entityQuery.sortExpression != '') {
    params.order = Sequelize.literal(entityQuery.sortExpression);
  }

  if(entityQuery.searchFilters.length > 0){
    const filters = [];

    entityQuery.searchFilters.forEach(function(sf) {
      filters.push(searchFilterToSequelize(sf));
    });

    params.where = {
      [getLogicOperator(entityQuery.isAndQuery)]: filters
    };
  }

  return params;
};

export const searchFilterCtor = (isAndFilter = true, isFilterGroup = false, propertyName = "", condition = SearchFilterCondition.None, valueInt = null, valueString = null, valueBoolean = null) => {
  return {
    isAndFilter,
    isFilterGroup,
    propertyName,
    condition,
    valueInt,
    valueString,
    valueBoolean,
    searchFilters: []
  };
};

export const searchFilterToSequelize = (searchFilter) => {
  if(searchFilter.isFilterGroup){
    const filters = [];

    searchFilter.searchFilters.forEach(function(sf) {
      filters.push(searchFilterToSequelize(sf));
    });

    return {
      [getLogicOperator(searchFilter.isAndFilter)]: filters
    };
  }
  else{
    let sf = {}
    sf[searchFilter.propertyName] = getOperatorAndFilter(searchFilter)

    return sf;
  }
};

export const searchFilterConditionToSequelizeOperator = (searchFilterCondition) => {
  let sequalizeOp = Sequelize.Op.eq;

  switch (searchFilterCondition) {
    case SearchFilterCondition.Is:
      sequalizeOp = Sequelize.Op.eq;
      break;
    case SearchFilterCondition.IsNot:
      sequalizeOp = Sequelize.Op.ne;
      break;
  }

  return sequalizeOp;
};

export const getSearchFilterValue = (searchFilter) => {
  if(searchFilter.valueInt != null){
    return searchFilter.valueInt;
  }
  else if(searchFilter.valueString != null){
    return searchFilter.valueString;
  }
  else if(searchFilter.valueBoolean != null){
    return searchFilter.valueBoolean;
  }
  else {
    return null;
  }
}

export const getPropertyAndFilter = (searchFilter) => {
  let ret = {};
  ret[searchFilter.propertyName] = getSearchFilterValue(searchFilter);
  return ret;
}

export const getOperatorAndFilter = (searchFilter) => {
  return {
    [searchFilterConditionToSequelizeOperator(searchFilter.condition)]: getSearchFilterValue(searchFilter)
  };
}

export const getLogicOperator = (isAnd) => {
  if(isAnd){
    return Sequelize.Op.and;
  }
  else{
    return Sequelize.Op.or;
  }
};

export const SearchFilterCondition = {
  None: 0,
  Contains: 1,
  StartsWith: 2,
  EndsWith: 3,
  Is: 4,
  In: 5,
  IsDBNull: 6,
  IsNotDBNull: 7,
  Between: 8,
  IsNot: 9,
  IsTrue: 10,
  IsFalse: 11,
  InFlag: 12,
  IsLessThanOrEqual: 13,
  IsLessThan: 14,
  NotIn: 15,
  Before: 16,
  After: 17,
  IsGreaterThanOrEqual: 18,
  IsGreaterThan: 19
};