import { gql } from "apollo-server-express";

import propertySchema from "./property";
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

export default [linkSchema, propertySchema, entityQuerySchema];
