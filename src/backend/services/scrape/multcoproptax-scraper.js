import puppeteer from "puppeteer";
import _ from "lodash";
import * as utilities from "../../utilities/utilities";
import accounting from "accounting-js";
import cheerio from "cheerio";
import moment from "moment";
import uuidv4 from "uuid/v4";

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

export const scrape = async address => {
  const infoUrls = {
    multcoproptax_url: "https://multcoproptax.com/Property-Search",
    portlandmaps_url: "https://www.portlandmaps.com",
    improvements: [],
    improvementsJson: JSON.stringify([]),
    permits: [],
    permitsJson: JSON.stringify([])
  };

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://multcoproptax.com/Property-Search", { waitUntil: "networkidle2" });

    await page.evaluate(a => {
      document.querySelector("#dnn_ctr410_MultnomahGuestView_SearchTextBox").value = a;
    }, address);

    await Promise.all([page.click("#SearchButtonDiv"), page.waitForNavigation({ waitUntil: "networkidle2" })]);

    const searchResultsJson = await page.evaluate(() => {
      return document.querySelector("#dnn_ctr410_MultnomahGuestView_SearchResultJson").value;
    });

    const searchResults = JSON.parse(searchResultsJson);
    const recordCount = _.get(searchResults, "RecordCount", 0);

    if (recordCount > 0) {
      const resultList = _.get(searchResults, "ResultList", []);
      if (resultList.length > 0) {
        const record = resultList[0];
        const situsAddress = _.get(record, "SitusAddress", "");
        const streetAddress = _.upperCase(situsAddress.split(",")[0]);
        const propertyQuickRefID = _.get(record, "PropertyQuickRefID", "");
        const partyQuickRefID = _.get(record, "PartyQuickRefID", "");

        infoUrls.multcoproptax_url = `https://multcoproptax.com/Property-Detail/PropertyQuickRefID/${propertyQuickRefID}/PartyQuickRefID/${partyQuickRefID}`;
        infoUrls.portlandmaps_url = `https://www.portlandmaps.com/detail/property/${streetAddress.replaceAll(" ", "-")}/${propertyQuickRefID}_did/`;

        // const row = await page.evaluate(() => {
        //   return document.querySelector("#grid > .k-grid-content > table > tbody > tr");
        // });
        //
        // if (row != null && row != "undefined") {
        //   console.log("found resultsGrid");
        // }

        await Promise.all([page.click("#grid > .k-grid-content > table > tbody > tr"), page.waitForNavigation({ waitUntil: "networkidle2" })]);

        const improvementsRows = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("#tblCama .datatable > tbody > tr:not(.tableHeaders)"));
        });

        if (improvementsRows != null && improvementsRows != "undefined") {
          // let improvementColumns = [];
          // for (let i = 0; i < improvementsRows.length; i++) {
          //   debugger;
          //   const source = await page.evaluate(element => element.outerHTML, improvementsRows[i]);
          //   improvementColumns = Array.from(await improvementsRows[i].$$("td"));
          //   const segmentType = await page.evaluate(element => element.textContent, improvementColumns[1]);
          //   const sqft = accounting.unformat(await page.evaluate(element => element.textContent, improvementColumns[4]));
          //
          //   infoUrls.improvements.push({
          //     segmentType,
          //     sqft
          //   });
          // }

          const improvementData = await page.evaluate(() => {
            const tds = Array.from(document.querySelectorAll("#tblCama .datatable > tbody > tr:not(.tableHeaders) td"));
            return tds.map(td => td.innerHTML);
          });

          if (improvementData != null) {
            const columnsPerRow = 5;
            const rows = improvementData.length / columnsPerRow;
            let offset = 0;

            for (let i = 0; i < rows; i++) {
              offset = i * columnsPerRow;
              const segmentType = improvementData[offset + 1];
              const sqft = accounting.unformat(improvementData[offset + 4]);

              infoUrls.improvements.push({
                key: uuidv4(),
                segmentType,
                sqft
              });
            }

            infoUrls.improvementsJson = JSON.stringify(infoUrls.improvements);
          }
        }

        await page.goto(infoUrls.portlandmaps_url, { waitUntil: "networkidle2" });
        await page.waitFor(3000);
        await Promise.all([page.click("#panel-zoning > .panel-heading > a")]);
        await page.waitFor(2000);
        await Promise.all([page.click("#detail-collapse-zoning #zoning button"), page.waitForNavigation({ waitUntil: "networkidle2" })]);
        await page.waitFor(5000);

        const permitsData = await page.evaluate(() => {
          const tds = Array.from(document.querySelectorAll("#permits-table > tbody > tr:not(.tableHeaders) td"));
          return tds.map(td => td.innerHTML);
        });

        if (permitsData != null) {
          const columnsPerRow = 5;
          const rows = permitsData.length / columnsPerRow;
          let offset = 0;

          for (let i = 0; i < rows; i++) {
            offset = i * columnsPerRow;

            const $ = cheerio.load(permitsData[offset]);
            const appNumberText = $("a").text();
            const appNumberHref = $("a").attr("href");

            const permitType = permitsData[offset + 2];
            const updated = permitsData[offset + 4];

            infoUrls.permits.push({
              key: uuidv4(),
              application: {
                number: appNumberText,
                href: appNumberHref
              },
              permitType,
              updated
            });
          }

          infoUrls.permits = _.chain(infoUrls.permits)
            .uniqBy(function(x) {
              return x.application.number;
            })
            .orderBy(
              function(x) {
                return new Number(moment(x.updated, "M/D/YY").format("X"));
              },
              ["desc"]
            )
            .value();

          infoUrls.permitsJson = JSON.stringify(infoUrls.permits);

          //console.table(infoUrls.permits);
        }

        //debugger;

        //utilities.writeFile(`portlandmaps.html`, await page.content());

        //await Promise.all([page.click("table#grid tr"), page.waitForNavigation({ waitUntil: "networkidle2" })]);
      }
    }

    await page.screenshot({ path: "example.png", fullPage: true });

    await page.close();
    await browser.close();
  } catch (e) {
    console.log(e);
    console.log("!!!!!!!!!!!!!!!!! getInfoUrls failed !!!!!!!!!!!!!!!!!");
  }

  return infoUrls;
};
