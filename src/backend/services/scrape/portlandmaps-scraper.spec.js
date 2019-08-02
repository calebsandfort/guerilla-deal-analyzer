import { expect, use } from "chai";
import chaiExclude from "chai-exclude";
import * as portlandmapsScraper from "./portlandmaps-scraper";

use(chaiExclude);

const PORTLAND_MAPS_URL = "https://www.portlandmaps.com/detail/property/1203-SE-MALDEN-ST/R134214_did/";
const ADDRESS = "1203 SE Malden St";

describe("portlandmaps-scraper", () => {
  // it("it finds the portlandmaps url for the given address", function() {
  //   this.timeout(10 * 60 * 1000);
  //
  //   const expectedResult = PORTLAND_MAPS_URL;
  //
  //   return portlandmapsScraper.findPortlandMapsUrl(ADDRESS).then(function(response) {
  //     expect(response).to.eql(expectedResult);
  //   });
  // });
});
