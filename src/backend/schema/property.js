import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    properties(offset: Int, limit: Int, order: String): [Property!]
    propertiesQueryable(query: EntityQuery): [Property!]
    property(id: ID!): Property
    findProperty(term: String!): Property
    findProperties(terms: [String!]!): [Property]
  }
  extend type Mutation {
    createProperty(input: PropertyInput!): Property!
    updateProperty(id: ID!, input: PropertyInput!): Property!
    deleteProperty(id: ID!): Boolean!
  }
  type Property {
    id: ID!
    zillow_propertyId: Int!
    zillow_path: String!
    zillow_url: String!
    zillow_imageUrl: String!
    streetAddress: String!
    city: String!
    state: String!
    zipcode: String!
    price: Float!
    sqft: Int!
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
  }
  input PropertyInput {
    zillow_propertyId: Int!
    zillow_path: String!
    zillow_url: String!
    zillow_imageUrl: String!
    streetAddress: String!
    city: String!
    state: String!
    zipcode: String!
    price: Float!
    sqft: Int!
    beds: Int!
    baths: Float!
    description: String!
    zestimate: Float!
    price_to_zestimate: Float!
    date_listed: Int!
    year_built: Int!
    zillow_status: String!
  }
`;
