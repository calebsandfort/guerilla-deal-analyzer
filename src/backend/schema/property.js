import { gql } from 'apollo-server-express';

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
    baths: Int!
    description: String!
    fullAddress: String!
    streetPlusZip: String!
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
      baths: Int!
      description: String!
  }
`;
