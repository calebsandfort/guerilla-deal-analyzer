import "cross-fetch/polyfill";
import ApolloClient from "apollo-boost";

export const getClient = () =>
  new ApolloClient({
    uri: "http://localhost:5050/graphql"
  });
