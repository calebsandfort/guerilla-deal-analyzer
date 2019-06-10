import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    properties(offset: Int, limit: Int, order: String): [Property!]
    propertiesQueryable(query: EntityQuery): [Property!]
    property(id: ID!): Property
    findProperty(term: String!, tag: String!, status: Int, persist: Boolean): FindPropertyResponse
    findProperties(terms: [String!]!, tag: String!, status: Int, persist: Boolean): [FindPropertyResponse]
    findComps(id: ID, term: String, tag: String, status: Int, persist: Boolean, compFilter: CompFilter, useCompCache: Boolean): [Property]
    findCompAddresses(id: ID!, compFilter: CompFilter!): [String]
    encodeImage(image_url: String): String
  }
  extend type Mutation {
    createProperty(input: PropertyInput!): Property!
    updateProperty(id: ID!, input: PropertyInput!): Property!
    expandoPropertyUpdate(id: ID!, input: ExpandoPropertyUpdateInput!): Property!
    compCacheUpdate(id: ID!, input: CompCacheUpdateInput!): Property!
    deleteProperty(id: ID!): Boolean!
  }
  type FindPropertyResponse {
    property: Property
    url: String
  }

  type Property {
    id: ID!
    zillow_propertyId: Int!
    zillow_path: String!
    zillow_url: String!
    streetAddress: String!
    city: String!
    state: String!
    zipcode: String!
    address: String!
    price: Float!
    sqft: Int!
    lotSize: Int!
    beds: Int!
    baths: Float!
    zestimate: Float!
    price_to_zestimate: Float!
    description: String!
    date_listed: String!
    days_listed: Int!
    year_built: Int!
    zillow_status: String!
    fullAddress: String!
    streetPlusZip: String!
    keywords(search_keywords: [String]): [String]
    keywords_count(search_keywords: [String]): Int
    keywords_set(search_keywords: [String]): Boolean
    image_urls: String!
    date_sold: String!
    latitude: Float!
    longitude: Float!
    days_since_sold: Int!
    image_urls_list: [String]
    notes: String
    status: Int!
    status_display: String
    tag: String
    distance(coord: CoordInput): Float
    distance_set(coord: CoordInput): Boolean
    engagement: Int
    pricePerSqft: Float
    compCacheArray: [String]
    compFilterJson: String
    propertyTaxesAnnually: Float
    propertyTaxesMonthly: Float
    insuranceAnnually: Float
    insuranceMonthly: Float
  }
  input PropertyInput {
    zillow_propertyId: Int!
    zillow_path: String!
    zillow_url: String!
    streetAddress: String!
    city: String!
    state: String!
    zipcode: String!
    address: String!
    price: Float!
    sqft: Int!
    lotSize: Int!
    beds: Int!
    baths: Float!
    description: String!
    zestimate: Float!
    price_to_zestimate: Float!
    date_listed: String!
    year_built: Int!
    zillow_status: String!
    image_urls: String!
    date_sold: String!
    latitude: Float!
    longitude: Float!
    notes: String
    status: Int!
    compCache: String
    propertyTaxesAnnually: Float
    propertyTaxesMonthly: Float
    insuranceAnnually: Float
    insuranceMonthly: Float
  }
  input ExpandoPropertyUpdateInput {
    notes: String
    status: Int!
  }
  input CompCacheUpdateInput {
    compCache: String
    compFilterJson: String
  }
  input CoordInput {
    latitude: Float!
    longitude: Float!
  }
  input CompFilter {
    minBeds: Int
    maxBeds: Int
    minSqft: Float
    maxSqft: Float
    minLotSqft: Float
    maxLotSqft: Float
    minYearBuilt: Int
    maxYearBuilt: Int
    minBaths: Int
    searchDistance: Float
  }
`;
