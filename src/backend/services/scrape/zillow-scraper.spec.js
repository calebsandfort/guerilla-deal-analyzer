import { expect, use } from "chai";
import chaiExclude from "chai-exclude";
import _ from "lodash";

import * as zillowScraper from "./zillow-scraper";

use(chaiExclude);

describe("zillow-scraper", () => {

    it("finds a property for the given address", function () {
        this.timeout(10 * 60 * 1000);

        const expectedResult = getExpectedProperty();

        const address = "7416 N Seneca St Portland, OR 97203";

        return zillowScraper.findProperty(address)
            .then(function (response) {
                expect(response).excluding(["description", "zillow_status"]).to.eql(expectedResult);
            });
    });

    it("finds a property for the given url", function () {
        this.timeout(10 * 60 * 1000);

        const expectedResult = getExpectedProperty();

        return zillowScraper.findProperty("/homedetails/7416-N-Seneca-St-Portland-OR-97203/53854858_zpid/")
            .then(function (response) {
                expect(response).excluding(["description", "zillow_status"]).to.eql(expectedResult);
            });
    });

    it("finds properties for the given urls", function () {
        this.timeout(10 * 60 * 1000);

        const expectedResult = 2;

        const urls = ["/homedetails/9235-N-Buchanan-Ave-Portland-OR-97203/53935576_zpid/", "/homedetails/7948-N-Bank-St-Portland-OR-97203/53821281_zpid/"];

        return zillowScraper.findProperties(urls)
            .then(function (response) {
                expect(_.filter(response, function (p) {
                    return p.zillow_propertyId > 0;
                }).length).to.eql(expectedResult);
            });
    });
});

const getExpectedProperty = () => {
    return {
        zillow_propertyId: 53854858,
        // zillow_listingId: 0,
        zillow_path: "/homedetails/7416-N-Seneca-St-Portland-OR-97203/53854858_zpid/",
        zillow_url: "https://www.zillow.com/homedetails/7416-N-Seneca-St-Portland-OR-97203/53854858_zpid/?fullpage=true",
        zillow_imageUrl: "https://photos.zillowstatic.com/p_d/IS2naalpbd56r71000000000.jpg",
        address: "7416 N Seneca St Portland, OR 97203",
        price : 175000,
        // propertyTaxesAnnually: 0,
        // propertyTaxesMonthly: 0,
        // insuranceAnnually: 0,
        // insuranceMonthly: 0,
        sqft: 1452,
        // listingPriceSqft: 0,
        beds: 2,
        baths: 1
    };
}