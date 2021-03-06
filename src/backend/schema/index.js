import { gql } from "apollo-server-express";

import propertySchema from "./property";
import dealWizardSchema from "./dealAnalysis";
import dealAnalysisSchema from "./dealAnalysis";
import compPackageSchema from "./compPackage";
import compSchema from "./comp";
import repairEstimateSchema from "./repairEstimate";
import repairEstimateSectionSchema from "./repairEstimateSection";
import repairEstimateSubSectionSchema from "./repairEstimateSubSection";
import repairEstimateLineItemSchema from "./repairEstimateLineItem";
import entityQuerySchema from "./entityQuery";

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;

export default [
  linkSchema,
  propertySchema,
  dealWizardSchema,
  dealAnalysisSchema,
  compPackageSchema,
  compSchema,
  repairEstimateSchema,
  repairEstimateSectionSchema,
  repairEstimateSubSectionSchema,
  repairEstimateLineItemSchema,
  entityQuerySchema
];
