import { gql } from 'apollo-server-express';

export default gql`
  input EntityQuery {
      isAndQuery: Boolean!
      enablePaging: Boolean!
      startRowIndex: Int
      maximumRows: Int
      sortExpression: String
      searchFilters: [SearchFilter!]!
  }
  
  input SearchFilter {
      isAndFilter: Boolean!
      isFilterGroup: Boolean!
      propertyName: String!
      condition: Int!
      valueInt: Int
      valueString: String
      valueBoolean: Boolean
      searchFilters: [SearchFilter!]
  }
`;