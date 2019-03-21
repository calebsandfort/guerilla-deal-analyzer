import rp from 'request-promise'
import axios from 'axios'
import $ from 'cheerio'
import _ from 'lodash'
import * as utilities from '../../../utilities/utilities';

const FIND_URL = '/do/location-autocomplete';
const INITIAL_INFO_URL = '/api/home/details/initialInfo';
const BELOW_THE_FOLD_URL = '/api/home/details/belowTheFold';
const AVM_URL = '/api/home/details/avm';

const getAxiosInstance = () => {
  return axios.create({
    baseURL: 'https://www.redfin.com/stingray/'
  });
}

export const findProperty = async (address) => {
  const property = {
    redfin_propertyId: 0,
    redfin_listingId: 0,
    redfin_path: '',
    redfin_url: '',
    redfin_imageUrl: '',
    address,
    listingPrice: 0,
    propertyTaxesAnnually: 0,
    propertyTaxesMonthly: 0,
    insuranceAnnually: 0,
    insuranceMonthly: 0,
    sqft: 0,
    listingPriceSqft: 0,
    beds: 0,
    baths: 0
  };

  const ai = getAxiosInstance();

  const findResponse = await ai.get(FIND_URL, {
    params: {
      location: address.replace(',', ' '),
      start: 0,
      count: 1,
      v: 2
    }
  }).catch(function (error) {
    console.log(error);
    return property;
  });

  const findData = parseResponse(findResponse);

  if(findData && findData.errorMessage == "Success" && findData.payload && findData.payload.exactMatch){
    property.redfin_propertyId = getPropertyId(findData.payload.exactMatch.id);
    utilities.setPropertyFromObject(findData, 'payload.exactMatch.url', property, 'redfin_path', '');
    property.redfin_url = `https://www.redfin.com${property.redfin_path}`;
  }

  if(property.redfin_propertyId > 0){
    const initialInfoResponse = await ai.get(INITIAL_INFO_URL, {
      params: {
        path: property.redfin_path
      }
    }).catch(function (error) {
      console.log(error);
      return property;
    });

    const initialInfoData = parseResponse(initialInfoResponse);
    utilities.setPropertyFromObject(initialInfoData, 'payload.listingId', property, 'redfin_listingId', 0);
    utilities.setPropertyFromObject(initialInfoData, 'payload.preloadImageUrl', property, 'redfin_imageUrl', '');

    if(property.redfin_listingId > 0){
      const belowTheFoldResponse = await ai.get(BELOW_THE_FOLD_URL, {
        params: {
          propertyId: property.redfin_propertyId,
          listingId: property.redfin_listingId,
          accessLevel: 1,
          pageType: 1
        }
      }).catch(function (error) {
        console.log(error);
        return property;
      });

      const belowTheFoldData = parseResponse(belowTheFoldResponse);
      utilities.setPropertyFromObject(belowTheFoldData, 'payload.publicRecordsInfo.mortgageCalculatorInfo.listingPrice',
          property, 'listingPrice', 0);
      utilities.setPropertyFromObject(belowTheFoldData, 'payload.publicRecordsInfo.taxInfo.taxesDue',
          property, 'propertyTaxesAnnually', 0);
      property.propertyTaxesMonthly = Math.ceil(property.propertyTaxesAnnually / 12);
      property.insuranceAnnually = Math.ceil(property.listingPrice * _.get(belowTheFoldData, 'payload.publicRecordsInfo.mortgageCalculatorInfo.homeInsuranceRate', 0) / 100)
      property.insuranceMonthly = Math.ceil(property.insuranceAnnually / 12);

      const avmResponse = await ai.get(AVM_URL, {
        params: {
          propertyId: property.redfin_propertyId,
          listingId: property.redfin_listingId,
          accessLevel: 3
        }
      }).catch(function (error) {
        console.log(error);
        return property;
      });


      const avmData = parseResponse(avmResponse);
      utilities.setPropertyFromObject(avmData, 'payload.sqFt.value', property, 'sqft', 0);
      property.listingPriceSqft = parseFloat((property.listingPrice / property.sqft).toFixed(2));
      utilities.setPropertyFromObject(avmData, 'payload.numBeds', property, 'beds', 0);
      utilities.setPropertyFromObject(avmData, 'payload.numBaths', property, 'baths', 0);

      //extract comparables here
    }
  }

  return property;
}

export const scrapeProperty = async (p) => {
  let property = Object.assign({}, p);

  const html = await rp(property.url);

  property.price = parseNumberFromElement($('.statsValue > div > span', getByRfTestId('abp-price', html)).last(), parseFloat);
  property.beds = parseNumberFromElement($('.statsValue', getByRfTestId('abp-beds', html)).last(), parseFloat);
  property.baths = parseNumberFromElement($('.statsValue', getByRfTestId('abp-baths', html)).last(), parseFloat);
  property.sqft = parseNumberFromElement($('.statsValue', getByRfTestId('abp-sqFt', html)).last(), parseFloat);
  property.psqft = Math.floor(property.price / property.sqft);

  const mortageCalculatorRows = $("#MortgageCalculator .value", html);

  property.propertyTaxesMonthly = parseNumberFromElement(mortageCalculatorRows.eq(1), parseFloat);
  property.propertyTaxesAnnually = property.propertyTaxesMonthly * 12;

  property.insuranceMonthly = parseNumberFromElement(mortageCalculatorRows.eq(2), parseFloat);
  property.insuranceAnnually = property.propertyTaxesMonthly * 12;

  return property;
}

const parseNumberFromElement = (el, func) => {
  return func(el.text().replace(',', '').replace('$', ''));
}

const getByRfTestId = (id, html) => {
  const els = $(`[data-rf-test-id="${id}"]`, html);
  return els.first();
}

const parseResponse = (response) => {
  return JSON.parse(response.data.replace("{}&&", ""));
}

const getPropertyId = (source) =>{
  let propertyId = 0;

  const re = /\d+_(\d+)/;
  const matches = re.exec(source);
  if(matches != null && matches.length === 2){
    propertyId = parseInt(matches[1]);
  }

  return propertyId;
}
