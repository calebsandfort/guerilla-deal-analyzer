import Vue from "vue";
import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

console.log(process.env.VUE_APP_API_ENDPOINT);

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_API_ENDPOINT
});

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

// Install the vue plugin
Vue.use(VueApollo);

export default apolloProvider;
