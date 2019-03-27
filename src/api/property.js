import { gql } from "apollo-boost";
import { errorHandler } from "./index";

export const fragments = {
  simple: gql`
    fragment SimpleProperty on Property {
      id
      zillow_propertyId
      zillow_path
      zillow_url
      streetAddress
      city
      state
      zipcode
      fullAddress
      streetPlusZip
      price
      sqft
      beds
      baths
      description
      zillow_imageUrl
      zestimate
      price_to_zestimate
      keywords(search_keywords: $search_keywords)
      keywords_count(search_keywords: $search_keywords)
      date_listed
      days_listed
      year_built
    }
  `
};

const GET = gql`
  query($id: ID!) {
    property(id: $id) {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const GET_ALL = gql`
  query($search_keywords: [String]) {
    properties {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const FIND_PROPERTY = gql`
  query($term: String!, $search_keywords: [String]) {
    findProperty(term: $term) {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const FIND_PROPERTIES = gql`
  query($terms: [String!]!, $search_keywords: [String]) {
    findProperties(terms: $terms) {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const CREATE = gql`
  mutation($input: PropertyInput!) {
    createProperty(input: $input) {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const UPDATE = gql`
  mutation($id: ID!, $input: PropertyInput!) {
    updateProperty(id: $id, input: $input) {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const DELETE = gql`
  mutation($id: ID!) {
    deleteProperty(id: $id)
  }
`;

export const getRequestVariables = () => {
  return {
    id: 0,
    term: "",
    terms: "",
    search_keywords: []
  };
};

export const get = async (client, variables) =>
  client
    .query({
      query: GET,
      variables: variables
    })
    .catch(errorHandler);

export const getAll = async (client, variables) =>
  client
    .query({
      query: GET_ALL,
      variables: variables
    })
    .catch(errorHandler);

export const findProperty = async (client, variables) =>
  client
    .query({
      query: FIND_PROPERTY,
      variables: variables
    })
    .catch(errorHandler);

export const findProperties = async (client, variables) =>
  client
    .query({
      query: FIND_PROPERTIES,
      variables: variables
    })
    .catch(errorHandler);

export const create = async (client, variables) =>
  client
    .mutate({
      mutation: CREATE,
      variables: variables
    })
    .catch(errorHandler);

export const update = async (client, variables) =>
  client
    .mutate({
      mutation: UPDATE,
      variables: variables
    })
    .catch(errorHandler);

export const deleteProperty = async (client, variables) =>
  client
    .mutate({
      mutation: DELETE,
      variables: variables
    })
    .catch(errorHandler);

export const createFromList = async (client, list) => {
  const properties = [];

  for (let i = 0; i < list.length; i++) {
    properties.push(
      (await create(client, {
        input: list[i]
      })).data.createProperty
    );
  }

  return properties;
};
