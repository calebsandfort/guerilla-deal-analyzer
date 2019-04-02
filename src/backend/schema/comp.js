import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    comps(offset: Int, limit: Int, order: String): [Comp!]
    compsQueryable(query: EntityQuery): [Comp!]
    comp(id: ID!): Comp
  }
  extend type Mutation {
    createComp(input: CompInput!): Comp!
    updateComp(id: ID!, input: CompInput!): Comp!
    deleteComp(id: ID!): Boolean!
  }
  type Comp {
    id: ID!
    property: Property!
  }
  input CompInput {
    propertyId: ID!
  }
`;
