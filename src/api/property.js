import { gql } from "apollo-boost";
import { errorHandler } from "./index";
import * as statuses from "../backend/enums/statuses";
import * as utilities from "../backend/utilities/utilities";

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
      address
      streetPlusZip
      price
      sqft
      lotSize
      beds
      baths
      description
      zestimate
      price_to_zestimate
      keywords(search_keywords: $search_keywords)
      keywords_count(search_keywords: $search_keywords)
      keywords_set(search_keywords: $search_keywords)
      days_listed
      year_built
      date_sold
      latitude
      longitude
      days_since_sold
      image_urls_list
      status
      status_display
      notes
      tag
      distance(coord: $coord)
      distance_set(coord: $coord)
      engagement
      pricePerSqft
      compCacheArray
      compFilterJson
      propertyTaxesAnnually
      propertyTaxesMonthly
      insuranceAnnually
      insuranceMonthly
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
  query {
    properties {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const GET_ALL_QUERYABLE = gql`
  query($query: EntityQuery) {
    propertiesQueryable(query: $query) {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const FIND_PROPERTY = gql`
  query(
    $term: String!
    $tag: String!
    $status: Int
    $persist: Boolean
    $coord: CoordInput
    $search_keywords: [String]
  ) {
    findProperty(term: $term, tag: $tag, status: $status, persist: $persist) {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const FIND_PROPERTIES = gql`
  query(
    $terms: [String!]!
    $tag: String!
    $status: Int
    $persist: Boolean
    $search_keywords: [String]
    $coord: CoordInput
  ) {
    findProperties(
      terms: $terms
      tag: $tag
      status: $status
      persist: $persist
    ) {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const FIND_COMPS = gql`
  query(
    $id: ID
    $term: String
    $tag: String
    $status: Int
    $persist: Boolean
    $compFilter: CompFilter
    $coord: CoordInput
    $search_keywords: [String]
    $useCompCache: Boolean
  ) {
    findComps(
      id: $id
      term: $term
      tag: $tag
      status: $status
      persist: $persist
      compFilter: $compFilter
      useCompCache: $useCompCache
    ) {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const FIND_COMP_ADDRESSES = gql`
  query($id: ID!, $compFilter: CompFilter!) {
    findCompAddresses(id: $id, compFilter: $compFilter)
  }
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

const EXPANDO_UPDATE = gql`
  mutation($id: ID!, $input: ExpandoPropertyUpdateInput!) {
    expandoPropertyUpdate(id: $id, input: $input) {
      ...SimpleProperty
    }
  }
  ${fragments.simple}
`;

const COMP_CACHE_UPDATE = gql`
  mutation(
    $id: ID!
    $input: CompCacheUpdateInput!
    $search_keywords: [String]
    $coord: CoordInput
  ) {
    compCacheUpdate(id: $id, input: $input) {
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
    search_keywords: [],
    query: null,
    input: {},
    tag: "",
    status: statuses.statuses.ACTIVE.value,
    persist: true,
    triggerFindComps: true,
    fromAction: false,
    coord: {
      latitude: 0,
      longitude: 0
    },
    compFilter: utilities.defaultCompFilter(),
    useCompCache: true
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

export const getAllQueryable = async (client, variables) =>
  client
    .query({
      query: GET_ALL_QUERYABLE,
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

export const findComps = async (client, variables) =>
  client
    .query({
      query: FIND_COMPS,
      variables: variables
    })
    .catch(errorHandler);

export const findCompAddresses = async (client, variables) =>
  client
    .query({
      query: FIND_COMP_ADDRESSES,
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

export const expandoUpdate = async (client, variables) =>
  client
    .mutate({
      mutation: EXPANDO_UPDATE,
      variables: variables
    })
    .catch(errorHandler);

export const compCacheUpdate = async (client, variables) =>
  client
    .mutate({
      mutation: COMP_CACHE_UPDATE,
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
