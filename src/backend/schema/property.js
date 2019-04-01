import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    properties(offset: Int, limit: Int, order: String): [Property!]
    propertiesQueryable(query: EntityQuery): [Property!]
    property(id: ID!): Property
    findProperty(term: String!, tag: String!): Property
    findProperties(terms: [String!]!, tag: String!): [Property]
  }
  extend type Mutation {
    createProperty(input: PropertyInput!): Property!
    updateProperty(id: ID!, input: PropertyInput!): Property!
    expandoPropertyUpdate(
      id: ID!
      input: ExpandoPropertyUpdateInput!
    ): Property!
    deleteProperty(id: ID!): Boolean!
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
    keywords: [String]
    keywords_count: Int
    keywords_set: Boolean
    image_urls: String!
    date_sold: String!
    latitude: Float!
    longitude: Float!
    days_since_sold: Int!
    image_urls_list: [String]
    notes: String
    mood: Int!
    mood_display: String
    tag: String
  }
  input PropertyInput {
    zillow_propertyId: Int!
    zillow_path: String!
    zillow_url: String!
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
    image_urls: String!
    date_sold: String!
    latitude: Float!
    longitude: Float!
    notes: String
    mood: Int!
  }
  input ExpandoPropertyUpdateInput {
    notes: String
    mood: Int!
  }
`;
