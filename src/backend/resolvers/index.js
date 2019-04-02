import { GraphQLDateTime } from "graphql-iso-date";

import propertyResolvers from "./property";
import compPackageResolvers from "./compPackage";
import dealAnalysisResolvers from "./dealAnalysis";
import compResolvers from "./comp";
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
  compResolvers
];
