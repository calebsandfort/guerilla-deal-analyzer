import Sequelize from "sequelize";
import * as entityQuery from "../utilities/entityQuery";
import * as zillowScraper from "../services/scrape/zillow-scraper";
import moment from "moment";
import * as statuses from "../enums/statuses";

const findProperty = async (
  { term, tag, status = statuses.statuses.ACTIVE.value, persist = true },
  { models }
) => {
  let property = await findPropertyHelper(term, models);

  if (property == null) {
    const scrapedProperty = await zillowScraper.findProperty(term);
    if (scrapedProperty) {
      scrapedProperty.tag = tag;
      scrapedProperty.status = status;

      if (persist) {
        property = await models.Property.create(scrapedProperty);
      } else {
        property = scrapedProperty;
      }
    } else {
      return null;
    }
  }

  return property;
};

const findProperties = async (
  { terms, tag, status = statuses.statuses.ACTIVE.value, persist = true },
  { models }
) => {
  const properties = [];
  let counter = 0;

  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    let property = await findPropertyHelper(term, models);

    if (property == null) {
      const scrapedProperty = await zillowScraper.findProperty(term);
      if (scrapedProperty) {
        scrapedProperty.tag = tag;
        scrapedProperty.status = status;
        if (persist) {
          property = await models.Property.create(scrapedProperty);
        } else {
          property = scrapedProperty;
        }
      }
    }

    properties.push(property);

    if (counter > 50) {
      await new Promise(r => setTimeout(r, 1000 * 15));
      counter = 0;
    } else {
      counter += 1;
    }
  }

  return properties;
};

const findComps = async (
  { id, term, tag, status = statuses.statuses.ACTIVE.value, persist = true },
  { models }
) => {
  let property = null;

  if (id > 0) {
    property = await models.Property.findByPk(id);
  } else if (term != "") {
    property = await findPropertyHelper(term, models);
  }

  const compAddresses = zillowScraper.findComps({ property: property });

  const comps = await findProperties(
    {
      terms: compAddresses,
      tag: `COMP ${property.streetAddress}`,
      status: statuses.statuses.COMP.value,
      persist: persist
    },
    { models }
  );

  return comps;
};

const findPropertyHelper = async (term, models) => {
  let property = await models.Property.findOne({
    where: {
      [Sequelize.Op.or]: [
        { zillow_path: term },
        { streetAddress: term },
        { address: term }
      ]
    }
  });

  return property;
};

export default {
  findProperty,
  findProperties,
  findComps
};
