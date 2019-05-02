import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    repairEstimates(offset: Int, limit: Int, order: String): [RepairEstimate!]
    repairEstimatesQueryable(query: EntityQuery): [RepairEstimate!]
    repairEstimate(id: ID!): RepairEstimate
  }
  extend type Mutation {
    createRepairEstimate(input: RepairEstimateInput!): RepairEstimate!
    updateRepairEstimate(id: ID!, input: RepairEstimateInput!): RepairEstimate!
    deleteRepairEstimate(id: ID!): Boolean!
  }
  type RepairEstimate {
    id: ID!
    title: String
    totalCost: Float
    quick: Boolean
    sections: [RepairEstimateSection]
  }
  input RepairEstimateInput {
    repairEstimateId: ID!
    title: String
    totalCost: Float
    quick: Boolean
    sections: [RepairEstimateInput]
  }
`;
