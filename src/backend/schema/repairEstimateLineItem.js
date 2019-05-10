import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    repairEstimateLineItems(
      offset: Int
      limit: Int
      order: String
    ): [RepairEstimateLineItem!]
    repairEstimateLineItemsQueryable(
      query: EntityQuery
    ): [RepairEstimateLineItem!]
    repairEstimateLineItem(id: ID!): RepairEstimateLineItem
  }
  extend type Mutation {
    createRepairEstimateLineItem(
      input: RepairEstimateLineItemInput!
    ): RepairEstimateLineItem!
    updateRepairEstimateLineItem(
      id: ID!
      input: RepairEstimateLineItemInput!
    ): RepairEstimateLineItem!
    deleteRepairEstimateLineItem(id: ID!): Boolean!
  }
  type RepairEstimateLineItem {
    id: ID!
    selected: Boolean
    name: String
    quantity: Float
    unit: Int
    unitCost: Float
    totalCost: Float
  }
  input RepairEstimateLineItemInput {
    repairEstimateLineItemId: ID!
    selected: Boolean
    name: String
    quantity: Float
    unit: Int
    totalCost: Float
    repairCost: Float
  }
`;
