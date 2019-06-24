import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    repairEstimateSubSections(offset: Int, limit: Int, order: String): [RepairEstimateSubSection!]
    repairEstimateSubSectionsQueryable(query: EntityQuery): [RepairEstimateSubSection!]
    repairEstimateSubSection(id: ID!): RepairEstimateSubSection
  }
  extend type Mutation {
    createRepairEstimateSubSection(input: RepairEstimateSubSectionInput!): RepairEstimateSubSection!
    updateRepairEstimateSubSection(id: ID!, input: RepairEstimateSubSectionInput!): RepairEstimateSubSection!
    deleteRepairEstimateSubSection(id: ID!): Boolean!
  }
  type RepairEstimateSubSection {
    id: ID!
    selected: Boolean
    title: String
    totalCost: Float
    lineItems: [RepairEstimateLineItem]
  }
  input RepairEstimateSubSectionInput {
    repairEstimateSubSectionId: ID!
    selected: Boolean
    title: String
    totalCost: Float
    lineItems: [RepairEstimateLineItemInput]
  }
`;
