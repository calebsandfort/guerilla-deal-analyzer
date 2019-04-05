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
    this.timeout(2000);
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
});
