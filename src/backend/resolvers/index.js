import { GraphQLDateTime } from "graphql-iso-date";

import propertyResolvers from "./property";
// import {scalarResolverMap} from './scalars'

const customScalarResolver = {
  Date: GraphQLDateTime
};

export default [
  // scalarResolverMap,
  customScalarResolver,
  propertyResolvers
];
