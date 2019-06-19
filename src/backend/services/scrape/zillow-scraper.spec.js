import { expect, use } from "chai";
import chaiExclude from "chai-exclude";
import _ from "lodash";

import * as zillowScraper from "./zillow-scraper";

use(chaiExclude);

const ZILLOW_PROPERTY_URL = "https://www.zillow.com/homedetails/608-NE-Going-St-Portland-OR-97211/53879348_zpid/";
const ADDRESS = "1203 SE Malden St";

describe("zillow-scraper", () => {
  // it("it scrapes data from Zillow for the given zipcode", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = null;
  //
  //   return zillowScraper.getZipcodeData(97080).then(function(response) {
  //     expect(response).to.eql(expectedResult);
  //   });
  // });
  // it("finds comps for a property", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = 6;
  //
  //   return zillowScraper.findComps({ term: ADDRESS }).then(function(response) {
  //     console.log(response);
  //
  //     expect(response.length).to.eql(expectedResult);
  //   });
  // });
  // it("it finds the zillow url for the given address", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = ZILLOW_PROPERTY_URL;
  //
  //   return zillowScraper.findZillowUrl("10940 SE Cherry Blossom Dr Portland, OR 97216").then(function(response) {
  //     expect(response).to.eql(expectedResult);
  //   });
  // });
  // it("finds comps for a property id", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   //const expectedResult = getSimpleExpectedProperty();
  //
  //   return zillowScraper
  //     .findComps(ADDRESS + " Portland Or")
  //     .then(function(response) {
  //       expect(castToSimpleProperty(response)).to.eql(expectedResult);
  //     });
  // });
  // it("finds a property for the given address", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = getSimpleExpectedProperty();
  //
  //   return zillowScraper
  //     .findProperty(ADDRESS + " Portland Or")
  //     .then(function(response) {
  //       expect(castToSimpleProperty(response)).to.eql(expectedResult);
  //     });
  // });
  //
  // it("finds a property for the given address with no city/state", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = getSimpleExpectedProperty();
  //
  //   return zillowScraper.findProperty(ADDRESS).then(function(response) {
  //     expect(castToSimpleProperty(response)).to.eql(expectedResult);
  //   });
  // });
  // it("finds a property for the given url", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = getSimpleExpectedProperty();
  //
  //   return zillowScraper
  //     .findProperty(ZILLOW_PROPERTY_URL)
  //     .then(function(response) {
  //       expect(castToSimpleProperty(response)).to.eql(expectedResult);
  //     });
  // });
  //
  // it("finds a property for the given url with no http", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = getSimpleExpectedProperty();
  //
  //   return zillowScraper
  //     .findProperty(ZILLOW_PROPERTY_URL.replace("https://www.zillow.com", ""))
  //     .then(function(response) {
  //       expect(castToSimpleProperty(response)).to.eql(expectedResult);
  //     });
  // });
  // it("it finds the zillow url for the given address", async () => {
  //   const expectedResult =
  //     "https://www.zillow.com/homedetails/7445-SW-Stewart-St-Portland-OR-97223/48585125_zpid/";
  //
  //   const actualResult = await zillowScraper.findZillowUrl(
  //     "7445 SW Stewart St"
  //   );
  //
  //   expect(actualResult).to.eql(expectedResult);
  // });
  // it("finds a property for the given address", function () {
  //     this.timeout(10 * 60 * 1000);
  //
  //     const expectedResult = getExpectedProperty();
  //
  //     const address = "7416 N Seneca St Portland, OR 97203";
  //
  //     return zillowScraper.findProperty(address)
  //         .then(function (response) {
  //             expect(response).excluding(["description", "zillow_status"]).to.eql(expectedResult);
  //         });
  // });
  //
  // it("finds a property for the given url", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = getExpectedProperty();
  //
  //   return zillowScraper
  //     .findProperty(
  //       "https://www.zillow.com/homedetails/4804-N-CONCORD-AVE-PORTLAND-OR-97217/53944192_zpid/"
  //     )
  //     .then(function(response) {
  //       expect(response)
  //         .excluding(["description", "zillow_status"])
  //         .to.eql(expectedResult);
  //     });
  // });
  // it("scrapes property tax info", function() {
  // this.timeout(10 * 60 * 1000);
  //
  //  const expectedResult = {};
  //
  //  return zillowScraper
  //  .findPropertyTaxInfo({
  //     streetAddress: ADDRESS
  //   })
  //   .then(function(response) {
  //      expect(response).to.eql(expectedResult);
  //  });
  // });
  // it("trial scrapes", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = 0;
  //
  //   return zillowScraper
  //     .trialScrape(
  //       `https://www.estately.com/45.4451,-122.7113,45.4931,-122.5959?only_sold=sold&order=days_desc`,
  //       "estately"
  //     )
  //     .then(function(response) {
  //       expect(response.length).to.eql(expectedResult);
  //     });
  // });
  // it("trial seleniums", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = 0;
  //
  //   //https://multcoproptax.com/Property-Detail?PropertyQuickRefID=R135723&PartyQuickRefID=O132014
  //
  //   return zillowScraper
  //     .trialSelenium(
  //       "https://multcoproptax.com/Property-Search?searchtext=4544%20N%20Kerby%20Ave"
  //     )
  //     .then(function(response) {
  //       expect(response.length).to.eql(expectedResult);
  //     });
  // });
  // it("finds comps for a given property", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = 0;
  //
  //   return zillowScraper
  //     .findCompsTrulia(
  //       "https://www.trulia.com/sold/45.468155,45.490205,-122.585666,-122.541628_xy/2p_beds/800-1200_sqft/SINGLE-FAMILY_HOME_type/6_srl"
  //     )
  //     .then(function(response) {
  //       expect(response.length).to.eql(expectedResult);
  //     });
  // });
  // it("finds comps for a given property", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = 0;
  //
  //   return zillowScraper.findComps().then(function(response) {
  //     expect(response.length).to.eql(expectedResult);
  //   });
  // });
  //
  // it("finds properties for the given urls", function () {
  //     this.timeout(10 * 60 * 1000);
  //
  //     const expectedResult = 2;
  //
  //     const urls = ["/homedetails/9235-N-Buchanan-Ave-Portland-OR-97203/53935576_zpid/", "/homedetails/7948-N-Bank-St-Portland-OR-97203/53821281_zpid/"];
  //
  //     return zillowScraper.findProperties(urls)
  //         .then(function (response) {
  //             expect(_.filter(response, function (p) {
  //                 return p.zillow_propertyId > 0;
  //             }).length).to.eql(expectedResult);
  //         });
  // });
});

const castToSimpleProperty = property => {
  return {
    zillow_propertyId: property.zillow_propertyId,
    zillow_path: property.zillow_path,
    zillow_url: property.zillow_url,
    streetAddress: property.streetAddress
  };
};

const getSimpleExpectedProperty = () => {
  return {
    zillow_propertyId: 176565162,
    zillow_path: "/homedetails/124-SW-Woods-St-Portland-OR-97201/176565162_zpid/",
    zillow_url: "https://www.zillow.com/homedetails/124-SW-Woods-St-Portland-OR-97201/176565162_zpid/?fullpage=true",
    streetAddress: "124 SW Woods St"
  };
};

const getExpectedProperty = () => {
  return {
    zillow_propertyId: 53854858,
    // zillow_listingId: 0,
    zillow_path: "/homedetails/7416-N-Seneca-St-Portland-OR-97203/53854858_zpid/",
    zillow_url: "https://www.zillow.com/homedetails/7416-N-Seneca-St-Portland-OR-97203/53854858_zpid/?fullpage=true",
    zillow_imageUrl: "https://photos.zillowstatic.com/p_d/IS2naalpbd56r71000000000.jpg",
    address: "7416 N Seneca St Portland, OR 97203",
    price: 175000,
    // propertyTaxesAnnually: 0,
    // propertyTaxesMonthly: 0,
    // insuranceAnnually: 0,
    // insuranceMonthly: 0,
    sqft: 1452,
    // listingPriceSqft: 0,
    beds: 2,
    baths: 1
  };
};
