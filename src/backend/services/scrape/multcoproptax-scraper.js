import puppeteer from "puppeteer";
import _ from "lodash";

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

export const scrape = async address => {
  const infoUrls = {
    multcoproptax_url: "https://multcoproptax.com/Property-Search",
    portlandmaps_url: "https://www.portlandmaps.com"
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

    //https://multcoproptax.com/Property-Detail/PropertyQuickRefID/R134214/PartyQuickRefID/O1154676
    //https://www.portlandmaps.com/detail/property/1203-SE-MALDEN-ST/R134214_did/

    await page.close();
    await browser.close();

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
      }
    }
  } catch (e) {
    console.log("!!!!!!!!!!!!!!!!! getInfoUrls failed !!!!!!!!!!!!!!!!!");
  }

  return infoUrls;
};
