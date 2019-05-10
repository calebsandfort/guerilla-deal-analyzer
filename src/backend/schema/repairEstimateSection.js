import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    repairEstimateSections(
      offset: Int
      limit: Int
      order: String
    ): [RepairEstimateSection!]
    repairEstimateSectionsQueryable(
      query: EntityQuery
    ): [RepairEstimateSection!]
    repairEstimateSection(id: ID!): RepairEstimateSection
  }
  extend type Mutation {
    createRepairEstimateSection(
      input: RepairEstimateSectionInput!
    ): RepairEstimateSection!
    updateRepairEstimateSection(
      id: ID!
      input: RepairEstimateSectionInput!
    ): RepairEstimateSection!
    deleteRepairEstimateSection(id: ID!): Boolean!
  }
  type RepairEstimateSection {
    id: ID!
    selected: Boolean
    title: String
    totalCost: Float
    subSections: [RepairEstimateSubSection]
  }
  input RepairEstimateSectionInput {
    repairEstimateSectionId: ID!
    selected: Boolean
    title: String
    totalCost: Float
    subSections: [RepairEstimateSubSectionInput]
  }
`;
