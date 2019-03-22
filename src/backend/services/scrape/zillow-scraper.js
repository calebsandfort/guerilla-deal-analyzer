import rp from 'request-promise'
import $ from 'cheerio'
import * as utilities from '../../../utilities/utilities';

const FILE_PATH = 'src/backend/services/scrape/files/';

export const findProperty = async (term) => {
    const property = {
        zillow_propertyId: 0,
        zillow_path: '',
        zillow_url: '',
        zillow_imageUrl: '',
        zillow_status: '',
        // zillow_imageUrl: '',
        streetAddress: '',
        city: '',
        state: '',
        zipcode: '',
        price: 0,
        // propertyTaxesAnnually: 0,
        // propertyTaxesMonthly: 0,
        // insuranceAnnually: 0,
        // insuranceMonthly: 0,
        sqft: 0,
        //listingPriceSqft: 0,
        beds: 0,
        baths: 0,
        description: ''
    };

    let url = term;

    if(!url.startsWith("/")){
        url = `https://www.zillow.com/homes/${term.replace(' ', '-')}_rb/`;
    }

    if(url.indexOf('http') == -1){
        url = `https://www.zillow.com` + url;
    }

    const options = {
        uri: url,
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
        }
    }

    const html = await rp(options);
    //utilities.writeFile(FILE_PATH + "seneca.html", html);

    let zillowData = JSON.parse($("script#hdpApolloPreloadedData", html).first().html());
    zillowData = zillowData[Object.keys(zillowData)[0]].property;

    //utilities.writeFile(FILE_PATH + "zillowData.json", JSON.stringify(zillowData));

    property.zillow_propertyId = zillowData.zpid;
    property.zillow_path = zillowData.hdpUrl;
    property.zillow_url = 'https://www.zillow.com' + property.zillow_path + "?fullpage=true";

    debugger
    property.zillow_imageUrl = zillowData.mediumImageLink;
    property.zillow_status = zillowData.homeStatus;
    property.streetAddress = zillowData.streetAddress;
    property.city = zillowData.city;
    property.state = zillowData.state;
    property.zipcode = zillowData.zipcode;
    property.price = zillowData.price;
    property.sqft = zillowData.livingArea;
    property.beds = zillowData.bedrooms;
    property.baths = zillowData.bathrooms;
    property.description = zillowData.description;

    return property
}

export const findProperties = async (terms) => {
    const properties = [];

    for(let i = 0; i < terms.length; i++){
        properties.push(await findProperty(terms[i]));
    }

    return properties;
}

const setPrice = (property, zillowData) => {
    switch (property.zillow_status) {
        case "FOR_SALE":
        case "PENDING":
            property.price = zillowData.listingPrice;
            break;
        default:
            property.price = zillowData.price;
            break;
    }
}

export const parseNumberFromElement = (el, func) => {
    return func(el.text().replace(',', '').replace('$', ''));
}