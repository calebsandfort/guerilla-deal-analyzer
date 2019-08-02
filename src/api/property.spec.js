import { expect } from "chai";
import _ from "lodash";
import { getClient } from "./apollo-client-factory";
import * as propertyApi from "./property";

let client = null;

describe("property api", () => {
  before("before properties", async () => {
    client = getClient();
  });

  beforeEach(function() {
    this.timeout(5000);
  });

  // it("returns finds a list of properties", async () => {
  //   const expectedResult = 2;
  //
  //   const requestVariables = propertyApi.getRequestVariables();
  //   requestVariables.terms = [
  //     "/homedetails/15809-NE-Sacramento-St-Portland-OR-97230/53962272_zpid/",
  //     "/homedetails/619-NE-190th-Ave-Portland-OR-97230/53963405_zpid/"
  //   ];
  //
  //   requestVariables.search_keywords.push("Range");
  //
  //   const result = await propertyApi.findProperties(client, requestVariables);
  //
  //   expect(result.data.findProperties.length).to.eql(expectedResult);
  // });

  // it("it finds comps for the given property", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const requestVariables = propertyApi.getRequestVariables();
  //   requestVariables.id = 15;
  //
  //   return propertyApi
  //     .findComps(client, requestVariables)
  //     .then(function(response) {});
  // });

  // it("returns a property", async () => {
  //   const expectedResult = 2;
  //
  //   const requestVariables = propertyApi.getRequestVariables();
  //   // requestVariables.term = "https://www.zillow.com/homedetails/2124-SE-54th-Ave-Portland-OR-97215/53874539_zpid/";
  //   requestVariables.term = "2329 SE 58th Ave";
  //
  //   const result = await propertyApi.findProperty(client, requestVariables);
  //
  //   console.log(result.data.findProperty);
  //
  //   expect(result.data.findProperty).to.not.eql(null);
  // });

  // it("it finds comps for the given property", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const requestVariables = propertyApi.getRequestVariables();
  //   requestVariables.id = 15;
  //
  //   return propertyApi.findComps(client, requestVariables).then(function(response) {});
  // });
});
