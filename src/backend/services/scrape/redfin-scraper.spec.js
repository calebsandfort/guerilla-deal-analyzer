import { expect, use } from "chai";
import chaiExclude from 'chai-exclude';
import _ from "lodash";

import * as redfinScraper from "./redfin-scraper";

use(chaiExclude);

describe("redfin-scraper", () => {

  it("finds a property for the given address", function() {
    this.timeout(10 * 60 * 1000);

    const address = '711 Ne 113 Ave Portland, OR 97220';
    const expectedResult = {
      redfin_propertyId: 26533670,
      redfin_listingId: 102276122,
      redfin_path: '/OR/Portland/711-NE-113th-Ave-97220/home/26533670',
      redfin_url: 'https://www.redfin.com/OR/Portland/711-NE-113th-Ave-97220/home/26533670',
      redfin_imageUrl: "https://ssl.cdn-redfin.com/photo/84/mbpaddedwide/105/genMid.19514105_0.jpg",
      address,
      listingPrice : 215000,
      propertyTaxesAnnually: 3395,
      propertyTaxesMonthly: 283,
      insuranceAnnually: 430,
      insuranceMonthly: 36,
      sqft: 1118,
      listingPriceSqft: 192.31,
      beds: 3,
      baths: 2
    };

    return redfinScraper.findProperty(address)
        .then(function (response) {
          expect(response).to.eql(expectedResult);
        });
  });

  // it("scrapes a property", async () => {
  //   const base = {
  //     id: 26533670,
  //     path: '/OR/Portland/711-NE-113th-Ave-97220/home/26533670',
  //     url: 'https://www.redfin.com/OR/Portland/711-NE-113th-Ave-97220/home/26533670',
  //     address: '711 Ne 113 Ave Portland, OR 97220',
  //     price: 215000
  //   }
  //
  //   const expectedResult = Object.assign({}, base, {
  //     beds: 3,
  //     baths: 2,
  //     sqft: 1118,
  //     psqft: 192,
  //     propertyTaxesMonthly: 283,
  //     propertyTaxesAnnually: 283 * 12,
  //     insuranceMonthly: 36,
  //     insuranceAnnually: 36 * 12
  //   });
  //
  //   const response = await redfinScraper.scrapeProperty(base);
  //
  //   expect(response).to.eql(expectedResult);
  // });

});
