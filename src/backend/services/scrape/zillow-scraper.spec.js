import { expect, use } from "chai";
import chaiExclude from "chai-exclude";
import _ from "lodash";

import * as zillowScraper from "./zillow-scraper";

use(chaiExclude);

const ZILLOW_PROPERTY_URL =
  "https://www.zillow.com/homedetails/608-NE-Going-St-Portland-OR-97211/53879348_zpid/";
const ADDRESS = "4544 N Kerby Ave";

describe("zillow-scraper", () => {
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
  //   return zillowScraper
  //     .findZillowUrl("124 SW Woods St")
  //     .then(function(response) {
  //       expect(response).to.eql(expectedResult);
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
  //
  it("finds a property for the given url", function() {
    this.timeout(10 * 60 * 1000);

    const expectedResult = getSimpleExpectedProperty();

    return zillowScraper
      .findProperty(ZILLOW_PROPERTY_URL)
      .then(function(response) {
        expect(castToSimpleProperty(response)).to.eql(expectedResult);
      });
  });
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
  //   const expectedResult = ZILLOW_PROPERTY_URL;
  //
  //   const actualResult = zillowScraper
  //       .findZillowUrl("124 SW Woods St");
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
  //       "/homedetails/4944-SE-67th-Ave-Portland-OR-97206/54003518_zpid/"
  //     )
  //     .then(function(response) {
  //       expect(response)
  //         .excluding(["description", "zillow_status"])
  //         .to.eql(expectedResult);
  //     });
  // });

  // it("trial scrapes", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = 0;
  //
  //   return zillowScraper
  //     .trialScrape(
  //       "https://www.redfin.com/stingray/api/gis-csv?al=3&market=oregon&max_listing_approx_size=1250&max_num_beds=3&min_listing_approx_size=750&min_stories=1&num_baths=1&num_beds=2&num_homes=350&ord=distance-asc&page_number=1&poly=-122.58714%2045.46841%2C-122.54015%2045.46841%2C-122.54015%2045.48965%2C-122.58714%2045.48965%2C-122.58714%2045.46841&sold_within_days=180&status=9&uipt=1&v=8",
  //       "redfin_comps"
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
  //   return zillowScraper
  //     .trialSelenium(
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
    zillow_path:
      "/homedetails/124-SW-Woods-St-Portland-OR-97201/176565162_zpid/",
    zillow_url:
      "https://www.zillow.com/homedetails/124-SW-Woods-St-Portland-OR-97201/176565162_zpid/?fullpage=true",
    streetAddress: "124 SW Woods St"
  };
};

const getExpectedProperty = () => {
  return {
    zillow_propertyId: 53854858,
    // zillow_listingId: 0,
    zillow_path:
      "/homedetails/7416-N-Seneca-St-Portland-OR-97203/53854858_zpid/",
    zillow_url:
      "https://www.zillow.com/homedetails/7416-N-Seneca-St-Portland-OR-97203/53854858_zpid/?fullpage=true",
    zillow_imageUrl:
      "https://photos.zillowstatic.com/p_d/IS2naalpbd56r71000000000.jpg",
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
