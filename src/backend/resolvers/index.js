import { GraphQLDateTime } from "graphql-iso-date";

import propertyResolvers from "./property";
import compPackageResolvers from "./compPackage";
import dealAnalysisResolvers from "./dealAnalysis";
import compResolvers from "./comp";
import repairEstimateResolvers from "./repairEstimate";
import repairEstimateSectionResolvers from "./repairEstimateSection";
import repairEstimateSubSectionResolvers from "./repairEstimateSubSection";
import repairEstimateLineItemResolvers from "./repairEstimateLineItem";
// import {scalarResolverMap} from './scalars'

const customScalarResolver = {
  Date: GraphQLDateTime
};

export default [
  // scalarResolverMap,
  customScalarResolver,
  propertyResolvers,
  dealAnalysisResolvers,
  compPackageResolvers,
  compResolvers,
  repairEstimateResolvers,
  repairEstimateSectionResolvers,
  repairEstimateSubSectionResolvers,
  repairEstimateLineItemResolvers
];
