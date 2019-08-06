import { expect, use } from "chai";
import chaiExclude from "chai-exclude";
import * as multcoproptaxScraper from "./multcoproptax-scraper";
import _ from "lodash";

use(chaiExclude);

const MULTCOPROPTAX_URL = "https://multcoproptax.com/Property-Detail/PropertyQuickRefID/R134214/PartyQuickRefID/O1154676";
const ADDRESS = "1203 SE Malden St";

describe("multcoproptax-scraper", () => {
  it("it finds the multcoproptax url for the given address", function() {
    this.timeout(10 * 60 * 1000);

    const expectedResult = {
      multcoproptax_url: "https://multcoproptax.com/Property-Detail/PropertyQuickRefID/R134214/PartyQuickRefID/O1154676",
      portlandmaps_url: "https://www.portlandmaps.com/detail/property/1203-SE-MALDEN-ST/R134214_did/"
    };

    return multcoproptaxScraper.scrape(ADDRESS).then(function(response) {
      expect(response)
        .excluding(["improvements", "improvementsJson", "permits", "permitsJson"])
        .to.eql(expectedResult);
    });
  });
});
