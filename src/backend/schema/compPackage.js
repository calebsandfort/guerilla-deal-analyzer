import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    compPackages(offset: Int, limit: Int, order: String): [CompPackage!]
    compPackagesQueryable(query: EntityQuery): [CompPackage!]
    compPackage(id: ID!): CompPackage
  }
  extend type Mutation {
    createCompPackage(input: CompPackageInput!): CompPackage!
    updateCompPackage(id: ID!, input: CompPackageInput!): CompPackage!
    deleteCompPackage(id: ID!): Boolean!
  }
  type CompPackage {
    id: ID!
    ARV: Float!
    comps: [Comp]
  }
  input CompPackageInput {
    ARV: Float!
    comps: [CompInput]
  }
`;
