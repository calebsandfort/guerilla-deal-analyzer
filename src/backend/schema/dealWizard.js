import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    dealWizards(offset: Int, limit: Int, order: String): [DealWizard!]
    dealWizardsQueryable(query: EntityQuery): [DealWizard!]
    dealWizard(id: ID!): DealWizard
  }
  extend type Mutation {
    createDealWizard(input: DealWizardInput!): DealWizard!
    updateDealWizard(id: ID!, input: DealWizardInput!): DealWizard!
    deleteDealWizard(id: ID!): Boolean!
  }
  type DealWizard {
    id: ID!
    compPackage: CompPackage
    repairEstimate: RepairEstimate
    dealAnalysis: DealAnalysis
  }
  input DealWizardInput {
    compPackage: CompPackageInput
    repairEstimate: RepairEstimateInput
    dealAnalysis: DealAnalysisInput
  }
`;
