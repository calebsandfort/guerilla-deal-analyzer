import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    dealAnalyses(offset: Int, limit: Int, order: String): [DealAnalysis!]
    dealAnalysesQueryable(query: EntityQuery): [DealAnalysis!]
    dealAnalysis(id: ID!): DealAnalysis
  }
  extend type Mutation {
    createDealAnalysis(input: DealAnalysisInput!): DealAnalysis!
    updateDealAnalysis(id: ID!, input: DealAnalysisInput!): DealAnalysis!
    deleteDealAnalysis(id: ID!): Boolean!
  }
  type DealAnalysis {
    id: ID!
    compPackage: CompPackage
  }
  input DealAnalysisInput {
    compPackage: CompPackageInput
  }
`;
