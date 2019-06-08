import _ from "lodash";
import fs from "fs";
import * as repairEstimateSectionTypes from "../enums/repairEstimateSectionTypes";
import * as unitTypes from "../enums/unitTypes";
import * as loanTypes from "../enums/loanTypes";
import * as dealAnalysisSectionTypes from "../enums/dealAnalysisSectionTypes";
import { statuses } from "../enums/statuses";
import querystring from "querystring";
import uuidv4 from "uuid/v4";
import dealAnalysis from "../models/dealAnalysis";
import * as math from "mathjs";
import dealAnalysisUtilities from "./dealAnalysisUtilities";

//region Property Functions
export const newProperty = () => {
  return {
    zillow_propertyId: 0,
    zillow_path: "",
    zillow_url: "",
    streetAddress: "",
    city: "",
    state: "",
    zipcode: "",
    address: "",
    price: -1,
    sqft: -1,
    beds: -1,
    baths: -1,
    description: "",
    zestimate: -1,
    price_to_zestimate: -1,
    date_listed: -1,
    zillow_status: "",
    year_built: -1,
    image_urls: "",
    date_sold: "-1",
    latitude: -1,
    longitude: -1,
    notes: "",
    status: statuses.ACTIVE.value,
    compCache: "",
    propertyTaxesAnnually: 0,
    propertyTaxesMonthly: 0,
    insuranceAnnually: 0,
    insuranceMonthly: 0
  };
};

export const setKeywordsForList = (list, textPath, search_keywords) => {
  const requiresAction = _.filter(list, function(obj) {
    return obj.keywords_set == false;
  });

  _.each(requiresAction, function(obj) {
    setKeywords(obj, textPath, search_keywords);
  });
};

export const setKeywords = (obj, textPath, search_keywords) => {
  const lowerCaseDescription = obj[textPath].toLowerCase();
  obj.keywords = _.filter(search_keywords, function(skw) {
    return lowerCaseDescription.indexOf(skw.toLowerCase()) > -1;
  });
  obj.keywords_count = obj.keywords.length;
  obj.keywords_set = true;
};

export const setDistanceForList = (list, property) => {
  const requiresAction = _.filter(list, function(obj) {
    return obj.distance_set == false && obj.id != property.id;
  });

  _.each(requiresAction, function(obj) {
    setDistance(obj, property);
  });
};

export const setDistance = (prop1, prop2) => {
  prop1.distance = haversineDistance([prop1.longitude, prop1.latitude], [prop2.longitude, prop2.latitude], true);
  prop1.distance_set = true;
};

export const getDistance = (prop1, prop2) => {
  return haversineDistance([prop1.longitude, prop1.latitude], [prop2.longitude, prop2.latitude], true);
};

export const haversineDistance = function(coords1, coords2, isMiles) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  var lon1 = coords1[0];
  var lat1 = coords1[1];

  var lon2 = coords2[0];
  var lat2 = coords2[1];

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if (isMiles) d /= 1.60934;

  return d;
};

export const setPropertyFromObject = (source, sourcePath, target, targetPath, defaultValue) => {
  let propValue = _.get(source, sourcePath, defaultValue);
  if (propValue == null) {
    propValue = defaultValue;
  }
  _.set(target, targetPath, propValue);
};
//endregion

//region Deal Analysis Functions
export const newDealAnalysis = () => {
  return {
    //region Deal Factos
    DF_ARV: 0,
    DF_Ask: 0,
    DF_RepairCosts: 50000,
    DF_PurchasePrice: 0,
    DF_HoldTime: 6,
    PVP_TotalCost: 0,
    //endregion

    //region Holding Costs
    HC_PropertyTaxesAnnually: 0,
    HC_PropertyTaxesMonthly: 0,
    HC_InsuranceAnnually: 0,
    HC_InsuranceMonthly: 0,
    HC_HOAMonthly: 0,
    HC_Gas: 100,
    HC_Water: 100,
    HC_Electricity: 100,
    HC_OtherUtilities: 0,
    HC_UtilitiesMonthly: 0,
    HC_MiscMonthly: 0,
    HC_TotalCostMonthly: 0,
    HC_TotalCost: 0,
    //endregion

    //region Financing Costs
    FC_LoanType: loanTypes.loanTypes.PURCHASE_PLUS_REHAB.value,

    FC_LoanAmount: 0,
    FC_FirstMortgageAmount: 0.9,
    FC_FirstMortgagePoints: 3,
    FC_FirstMortgageInterest: 0.12,
    FC_FirstMortgageAmount_Cost: 0,
    FC_FirstMortgagePoints_Cost: 0,
    FC_FirstMortgageInterest_Cost: 0,
    FC_FirstMortgagePayment: 0,

    FC_SecondMortgageAmount: 0.1,
    FC_SecondMortgagePoints: 2,
    FC_SecondMortgageInterest: 0.12,
    FC_SecondMortgageAmount_Cost: 0,
    FC_SecondMortgagePoints_Cost: 0,
    FC_SecondMortgageInterest_Cost: 0,
    FC_SecondMortgagePayment: 0,

    FC_MiscMortgageAmount: 0,
    FC_MiscMortgagePoints: 0,
    FC_MiscMortgageInterest: 0,
    FC_MiscMortgageAmount_Cost: 0,
    FC_MiscMortgagePoints_Cost: 0,
    FC_MiscMortgageInterest_Cost: 0,
    FC_MiscMortgagePayment: 0,

    FC_MiscCost: 0,
    FC_TotalCost: 0,
    //endregion

    //region Buying Transaction Costs
    BTC_TitleInsuranceSearch: 0.01,
    BTC_TitleInsuranceSearch_Cost: 0,
    BTC_EscrowAttorney: 1000,
    BTC_Misc: 0,
    BTC_TotalCost: 0,
    //endregion

    //region Selling Transaction Costs
    STC_RealtorFees: 0.045,
    STC_RealtorFees_Cost: 0,
    STC_TransferConveyenceFees: 0.01,
    STC_TransferConveyenceFees_Cost: 0,
    STC_Misc: 0,
    STC_Staging: 1500,
    STC_EscrowAttorney: 0,
    STC_SellingRecording: 500,
    STC_HomeWarranty: 500,
    STC_Marketing: 1000,
    STC_TotalCost: 0,
    //endregion

    //region Snapshot
    SNAP_Profit: 0,
    SNAP_ROI: 0.15,
    SNAP_DownPayment: 0,
    SNAP_CommittedCapital: 0,
    SNAP_TotalCost: 0,
    SNAP_DiscountCost: 0,
    SNAP_DiscountPercent: 0
    //endregion
  };
};

export const dealAnalysisSections = dealAnalysis => {
  return [
    {
      sectionType: dealAnalysisSectionTypes.dealAnalysisSectionTypes.FINANCING_COSTS,
      headers: [{ text: "Title", align: "left", sortable: false }, { text: "", align: "left", sortable: false }, { text: "", align: "left", sortable: false }],
      items: [
        {
          key: uuidv4(),
          title: "First Mortgage/Lien Amount",
          field1: "FC_FirstMortgageAmount",
          readonly1: false,
          currency1: "%",
          field2: "FC_FirstMortgageAmount_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "First Mortgage Points",
          field1: "FC_FirstMortgagePoints",
          readonly1: false,
          currency1: "",
          field2: "FC_FirstMortgagePoints_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "First Mortgage Interest",
          field1: "FC_FirstMortgageInterest",
          readonly1: false,
          currency1: "%",
          field2: "FC_FirstMortgageInterest_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "First Mortgage Payment",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "FC_FirstMortgagePayment",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Second Mortgage/Lien Amount",
          field1: "FC_SecondMortgageAmount",
          readonly1: false,
          currency1: "%",
          field2: "FC_SecondMortgageAmount_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Second Mortgage Points",
          field1: "FC_SecondMortgagePoints",
          readonly1: false,
          currency1: "",
          field2: "FC_SecondMortgagePoints_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Second Mortgage Interest",
          field1: "FC_SecondMortgageInterest",
          readonly1: false,
          currency1: "%",
          field2: "FC_SecondMortgageInterest_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Second Mortgage Payment",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "FC_SecondMortgagePayment",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Misc Mortgage/Lien Amount",
          field1: "FC_MiscMortgageAmount",
          readonly1: false,
          currency1: "%",
          field2: "FC_MiscMortgageAmount_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Misc Mortgage Points",
          field1: "FC_MiscMortgagePoints",
          readonly1: false,
          currency1: "",
          field2: "FC_MiscMortgagePoints_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Misc Mortgage Interest",
          field1: "FC_MiscMortgageInterest",
          readonly1: false,
          currency1: "%",
          field2: "FC_MiscMortgageInterest_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Misc Mortgage Payment",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "FC_MiscMortgagePayment",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Misc Financing Costs",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "FC_MiscCost",
          readonly2: false,
          currency2: "$"
        }
      ]
    },
    {
      sectionType: dealAnalysisSectionTypes.dealAnalysisSectionTypes.BUYING_COSTS,
      headers: [
        { text: "Title", align: "left", sortable: false },
        { text: "% of Purchase", align: "left", sortable: false },
        { text: "Total", align: "left", sortable: false }
      ],
      items: [
        {
          key: uuidv4(),
          title: "Escrow/Attorney Fees",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "BTC_EscrowAttorney",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Title Insurance/Search Costs",
          field1: "BTC_TitleInsuranceSearch",
          readonly1: false,
          currency1: "%",
          field2: "BTC_TitleInsuranceSearch_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Misc. Buying Costs",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "BTC_Misc",
          readonly2: false,
          currency2: "$"
        }
      ]
    },
    {
      sectionType: dealAnalysisSectionTypes.dealAnalysisSectionTypes.HOLDING_COSTS,
      headers: [
        { text: "Title", align: "left", sortable: false },
        { text: "Annually", align: "left", sortable: false },
        { text: "Monthly", align: "left", sortable: false }
      ],
      items: [
        {
          key: uuidv4(),
          title: "Property Taxes",
          field1: "HC_PropertyTaxesAnnually",
          readonly1: false,
          currency1: "$",
          field2: "HC_PropertyTaxesMonthly",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Insurance",
          field1: "HC_InsuranceAnnually",
          readonly1: false,
          currency1: "$",
          field2: "HC_InsuranceMonthly",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "HOA Fees",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "HC_HOAMonthly",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Gas",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "HC_Gas",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Water",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "HC_Water",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Electricity",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "HC_Electricity",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Other Utils",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "HC_OtherUtilities",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Utils Monthly",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "HC_UtilitiesMonthly",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Misc Monthly",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "HC_MiscMonthly",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Total Monthly",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "HC_TotalCostMonthly",
          readonly2: true,
          currency2: "$"
        }
      ]
    },
    {
      sectionType: dealAnalysisSectionTypes.dealAnalysisSectionTypes.SELLING_COSTS,
      headers: [
        { text: "Title", align: "left", sortable: false },
        { text: "% of ARV", align: "left", sortable: false },
        { text: "Total", align: "left", sortable: false }
      ],
      items: [
        {
          key: uuidv4(),
          title: "Escrow/Attorney Fees",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "STC_EscrowAttorney",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Selling Recording Fees",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "STC_SellingRecording",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Realtor Fees",
          field1: "STC_RealtorFees",
          readonly1: false,
          currency1: "%",
          field2: "STC_RealtorFees_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Transfer & Conveyance Fees",
          field1: "STC_TransferConveyenceFees",
          readonly1: false,
          currency1: "%",
          field2: "STC_TransferConveyenceFees_Cost",
          readonly2: true,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Home Warranty",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "STC_HomeWarranty",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Staging Costs",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "STC_Staging",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Marketing Costs",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "STC_Marketing",
          readonly2: false,
          currency2: "$"
        },
        {
          key: uuidv4(),
          title: "Misc. Selling Costs",
          field1: "",
          readonly1: false,
          currency1: "",
          field2: "STC_Misc",
          readonly2: false,
          currency2: "$"
        }
      ]
    }
  ];
};

//sections
//3 columns
//Title, val1 header, val2 header
//Data items
//Title, val 1 field, val 2 field, val 1 formatter, val 2 formatter, val 1 editable, val 2 editable

//endregion

//region Repair Estimate Functions
export const newRepairEstimate = () => {
  return {
    title: "Repair Estimate",
    totalCost: 50000,
    quick: true,
    sections: [
      {
        selected: false,
        totalCost: 0,
        sectionType: repairEstimateSectionTypes.repairEstimateSectionTypes.EXTERIOR.value,
        subSections: [
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Roof",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Roof (rip and replace) - Architectual Shingle",
                quantity: 0,
                unit: 1,
                unitCost: 4,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Rollover (add a layer of shingles) - Architectual Shingle",
                quantity: 0,
                unit: 1,
                unitCost: 2.5,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: 'Roof Sheathing - plywood 1/2" remove & install',
                quantity: 0,
                unit: 1,
                unitCost: 2,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Roof repair/patch (hard)",
                quantity: 0,
                unit: 2,
                unitCost: 900,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Roof repair/patch (easy)",
                quantity: 0,
                unit: 2,
                unitCost: 600,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Premium for 3 layer tear off",
                quantity: 0,
                unit: 1,
                unitCost: 0.35,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Premium for steep pitched roof",
                quantity: 0,
                unit: 1,
                unitCost: 0.2,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Fascia - demo & install new",
                quantity: 0,
                unit: 3,
                unitCost: 3,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Soffit - demo & install new",
                quantity: 0,
                unit: 3,
                unitCost: 4,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Gutters",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Gutters & downspouts - demo & install new (Flat Cost)",
                quantity: 0,
                unit: 1,
                unitCost: 0.5,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Gutters & downspouts - demo & install new (linear foot)",
                quantity: 0,
                unit: 3,
                unitCost: 6,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Finish",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Demo existing finishing material",
                quantity: 0,
                unit: 1,
                unitCost: 0.75,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Stucco",
                quantity: 0,
                unit: 1,
                unitCost: 7,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Wood Siding",
                quantity: 0,
                unit: 1,
                unitCost: 6,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Vinyl Siding",
                quantity: 0,
                unit: 1,
                unitCost: 2.25,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Fiber cement siding",
                quantity: 0,
                unit: 1,
                unitCost: 7,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Plywood panel siding",
                quantity: 0,
                unit: 1,
                unitCost: 2.5,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Patch an exterior section",
                quantity: 0,
                unit: 4,
                unitCost: 500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Power wash exterior finish",
                quantity: 0,
                unit: 1,
                unitCost: 0.75,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Masonry",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Fireplace/chimney, brick/stone",
                quantity: 0,
                unit: 4,
                unitCost: 5000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Concrete block",
                quantity: 0,
                unit: 1,
                unitCost: 6,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Stone",
                quantity: 0,
                unit: 1,
                unitCost: 18,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Brick",
                quantity: 0,
                unit: 1,
                unitCost: 11.5,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Tuckpoint brick",
                quantity: 0,
                unit: 1,
                unitCost: 3.5,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Power wash exterior masonry",
                quantity: 0,
                unit: 1,
                unitCost: 0.75,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Painting",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Painting Exterior & Interior Combine (Whole Property)",
                quantity: 0,
                unit: 1,
                unitCost: 3,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Painting Exterior Only",
                quantity: 0,
                unit: 1,
                unitCost: 2,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Paint trim only",
                quantity: 0,
                unit: 3,
                unitCost: 1.65,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Sand & refinish deck or paint deck",
                quantity: 0,
                unit: 1,
                unitCost: 1.75,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Paint fence",
                quantity: 0,
                unit: 1,
                unitCost: 1,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Paint detached garage",
                quantity: 0,
                unit: 1,
                unitCost: 1,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Windows",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Windows, vinyl, average size",
                quantity: 0,
                unit: 2,
                unitCost: 250,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Windows, wood, restore existing wood (historical)",
                quantity: 0,
                unit: 2,
                unitCost: 450,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Window, large bay window - remove & replace",
                quantity: 0,
                unit: 2,
                unitCost: 850,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Garage",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Garage Door Only -  1 Car - 9'x7'  door, manual",
                quantity: 0,
                unit: 2,
                unitCost: 775,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Garage Door Only - 2 Car - 16' door, manual",
                quantity: 0,
                unit: 2,
                unitCost: 1000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Garage Door Opener Installed",
                quantity: 0,
                unit: 2,
                unitCost: 225,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Reroof detached garage (rip & replace)",
                quantity: 0,
                unit: 1,
                unitCost: 4,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Build new detached garage",
                quantity: 0,
                unit: 1,
                unitCost: 30,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Landscaping",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Full Landscaping Makeover Large Lot",
                quantity: 0,
                unit: 4,
                unitCost: 5000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Full Landscaping Makeover Medium Lot",
                quantity: 0,
                unit: 4,
                unitCost: 3500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Full Landscaping Makeover Small Lot",
                quantity: 0,
                unit: 4,
                unitCost: 2000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Clean Up Landscaping & Yard Only",
                quantity: 0,
                unit: 4,
                unitCost: 500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Tree Removal, per tree",
                quantity: 0,
                unit: 2,
                unitCost: 500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Tree Planting (per tree)",
                quantity: 0,
                unit: 2,
                unitCost: 130,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Concrete/Asphalt",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Demo existing concrete or asphalt",
                quantity: 0,
                unit: 1,
                unitCost: 2,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Concrete installed for driveway/patio/sidewalk",
                quantity: 0,
                unit: 1,
                unitCost: 7,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Asphalt installed in driveway",
                quantity: 0,
                unit: 1,
                unitCost: 4,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Gravel installed for driveway/sidewalk",
                quantity: 0,
                unit: 1,
                unitCost: 2,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Decks",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "New deck 15'x15' (add permit if 30\" off ground)",
                quantity: 0,
                unit: 2,
                unitCost: 3000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "New Deck 10'x10'",
                quantity: 0,
                unit: 2,
                unitCost: 2000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "New Deck - treated lumber",
                quantity: 0,
                unit: 1,
                unitCost: 15,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "New Deck - cedar material",
                quantity: 0,
                unit: 1,
                unitCost: 19,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Decking material replacement only",
                quantity: 0,
                unit: 1,
                unitCost: 7,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Sand & refinish deck only",
                quantity: 0,
                unit: 2,
                unitCost: 2,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "New railings - wood",
                quantity: 0,
                unit: 3,
                unitCost: 20,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "New railings - metal",
                quantity: 0,
                unit: 3,
                unitCost: 40,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Pergola",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "New Pergola Canopy 15'x15'",
                quantity: 0,
                unit: 2,
                unitCost: 2500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "New Pergola Canopy 10'x10'",
                quantity: 0,
                unit: 2,
                unitCost: 2000,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Fence",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Wood Fencing",
                quantity: 0,
                unit: 3,
                unitCost: 15,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Wrought Iron Fencing",
                quantity: 0,
                unit: 3,
                unitCost: 45,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Chainlink Fence",
                quantity: 0,
                unit: 3,
                unitCost: 8,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Pool",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Pool Completely Redone ($10k to $15k)",
                quantity: 0,
                unit: 2,
                unitCost: 10000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Pool (redo plaster only) ",
                quantity: 0,
                unit: 2,
                unitCost: 4500,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Exterior - Septic",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Septic (all new system)",
                quantity: 0,
                unit: 2,
                unitCost: 15000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Septic (new tank only)",
                quantity: 0,
                unit: 2,
                unitCost: 5500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Septic (replace leach field only)",
                quantity: 0,
                unit: 2,
                unitCost: 3000,
                totalCost: 0
              }
            ]
          }
        ]
      },
      {
        selected: false,
        totalCost: 0,
        sectionType: repairEstimateSectionTypes.repairEstimateSectionTypes.INTERIOR.value,
        subSections: [
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Painting",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Interior Painting Only",
                quantity: 0,
                unit: 1,
                unitCost: 2,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Add Extra Wall Prep (Damaged Walls)",
                quantity: 0,
                unit: 1,
                unitCost: 0.5,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Hardwood",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Hardwood flooring - solid wood",
                quantity: 0,
                unit: 1,
                unitCost: 7,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Engineered hardwood flooring",
                quantity: 0,
                unit: 1,
                unitCost: 6,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Laminate hardwood flooring",
                quantity: 0,
                unit: 1,
                unitCost: 4,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Sand & refinish existing hardwood flooring",
                quantity: 0,
                unit: 1,
                unitCost: 2,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Carpet / Vinyl",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Carpet",
                quantity: 0,
                unit: 1,
                unitCost: 1.35,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Vinyl or linoleum flooring",
                quantity: 0,
                unit: 1,
                unitCost: 2,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Tiling",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Ceramic floor tile - in kitchen",
                quantity: 0,
                unit: 1,
                unitCost: 10,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Backsplash wall tile - in kitchen",
                quantity: 0,
                unit: 1,
                unitCost: 15,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Ceramic floor tile - in bathrooms",
                quantity: 0,
                unit: 1,
                unitCost: 8,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Shower wall tile - in bathrooms",
                quantity: 0,
                unit: 1,
                unitCost: 9,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Shower accent wall tile - in bathrooms",
                quantity: 0,
                unit: 1,
                unitCost: 16,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Ceramic floor tile - other areas of house",
                quantity: 0,
                unit: 1,
                unitCost: 8,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Kitchen - (Grouped)",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "High end kitchen - cabinets & countertops",
                quantity: 0,
                unit: 2,
                unitCost: 12500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Median kitchen - cabinets & countertops",
                quantity: 0,
                unit: 2,
                unitCost: 10500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Low end kitchen - cabinets & countertops",
                quantity: 0,
                unit: 2,
                unitCost: 8500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Refinish cabinets & new countertops",
                quantity: 0,
                unit: 2,
                unitCost: 6500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Kitchen extra custom items",
                quantity: 0,
                unit: 2,
                unitCost: 500,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Appliances - (Grouped)",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Luxury Home Appliances",
                quantity: 0,
                unit: 2,
                unitCost: 12000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "High End Home Appliances",
                quantity: 0,
                unit: 2,
                unitCost: 7000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Median Price Home Appliances",
                quantity: 0,
                unit: 2,
                unitCost: 4500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Low End Home Appliances",
                quantity: 0,
                unit: 2,
                unitCost: 2000,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Kitchen - (By Item)",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Cabinets",
                quantity: 0,
                unit: 3,
                unitCost: 185,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Countertops",
                quantity: 0,
                unit: 1,
                unitCost: 65,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Sink",
                quantity: 0,
                unit: 2,
                unitCost: 350,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Sink Faucet",
                quantity: 0,
                unit: 2,
                unitCost: 350,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Garbage Disposal",
                quantity: 0,
                unit: 2,
                unitCost: 250,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Refrigerator",
                quantity: 0,
                unit: 2,
                unitCost: 1200,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Range",
                quantity: 0,
                unit: 2,
                unitCost: 850,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Range Hood",
                quantity: 0,
                unit: 2,
                unitCost: 400,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Dishwasher",
                quantity: 0,
                unit: 2,
                unitCost: 600,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Microwave",
                quantity: 0,
                unit: 2,
                unitCost: 350,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Bathroom - (Grouped)",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Large master bath - replace everything",
                quantity: 0,
                unit: 2,
                unitCost: 9000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Full bath - replace everything",
                quantity: 0,
                unit: 2,
                unitCost: 5500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Half bath - replace everything",
                quantity: 0,
                unit: 2,
                unitCost: 3000,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Bathroom - (By Item)",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Vanity cabinet",
                quantity: 0,
                unit: 2,
                unitCost: 700,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Vanity countertop - granite or other hard surface",
                quantity: 0,
                unit: 2,
                unitCost: 150,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Vanity mirror",
                quantity: 0,
                unit: 2,
                unitCost: 75,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Sink",
                quantity: 0,
                unit: 2,
                unitCost: 125,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Sink Faucet",
                quantity: 0,
                unit: 2,
                unitCost: 150,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Toilet",
                quantity: 0,
                unit: 2,
                unitCost: 200,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Bathtub - fiberglass",
                quantity: 0,
                unit: 2,
                unitCost: 450,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Bathtub & shower surround - fiberglass",
                quantity: 0,
                unit: 2,
                unitCost: 500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Shower stall & surround - fiberglass",
                quantity: 0,
                unit: 2,
                unitCost: 400,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Showerhead & faucet kit",
                quantity: 0,
                unit: 2,
                unitCost: 210,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Bathroom towel bar kit",
                quantity: 0,
                unit: 2,
                unitCost: 75,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Framing",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Interior or exterior wall framing ",
                quantity: 0,
                unit: 1,
                unitCost: 30,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Interior framing changes (non load bearing)",
                quantity: 0,
                unit: 1,
                unitCost: 6,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Open load bearing/structural wall",
                quantity: 0,
                unit: 2,
                unitCost: 1500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: 'Subfloor put in (3/4" plywood)',
                quantity: 0,
                unit: 1,
                unitCost: 1.85,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Insulation",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Wall insulation",
                quantity: 0,
                unit: 1,
                unitCost: 1,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Floor insulation",
                quantity: 0,
                unit: 1,
                unitCost: 1.25,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Attic insulation, blown-in",
                quantity: 0,
                unit: 1,
                unitCost: 0.8,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Walls",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Drywall, tape & skimcoat walls/ceilings in entire house when gutted ",
                quantity: 0,
                unit: 1,
                unitCost: 6,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: 'Drywall, tape, & skimcoat a wall (1/2" thick)',
                quantity: 0,
                unit: 1,
                unitCost: 2.5,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: 'Drywall, tape, & skimcoat a ceiling (1/2" thick)',
                quantity: 0,
                unit: 1,
                unitCost: 4,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Skimcoating/texturing walls and ceilings only",
                quantity: 0,
                unit: 1,
                unitCost: 1,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Patchwork section of a wall - (drywall, tape, & finish)",
                quantity: 0,
                unit: 2,
                unitCost: 500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Remove Popcorn Ceiling",
                quantity: 0,
                unit: 1,
                unitCost: 1,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Doors & Trim",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "New interior doors, closet doors, & trim (3000 sq ft house)",
                quantity: 0,
                unit: 2,
                unitCost: 4000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "New interior doors, closet doors, & trim (1500 sq ft house)",
                quantity: 0,
                unit: 2,
                unitCost: 2000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Interior door - prehung hollow-core door",
                quantity: 0,
                unit: 2,
                unitCost: 175,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Interior sliding closet door ",
                quantity: 0,
                unit: 2,
                unitCost: 175,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Exterior front door - single door w/ hardware & dead bolt ",
                quantity: 0,
                unit: 2,
                unitCost: 150,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Exterior french patio door - double door",
                quantity: 0,
                unit: 2,
                unitCost: 700,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Exterior sliding glass door - double door ",
                quantity: 0,
                unit: 2,
                unitCost: 850,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Crown molding",
                quantity: 0,
                unit: 3,
                unitCost: 3.75,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "New baseboard trim",
                quantity: 0,
                unit: 3,
                unitCost: 2.75,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Raised panel wood wainscoting",
                quantity: 0,
                unit: 3,
                unitCost: 17.5,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Basement",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Pour concrete floor in basement",
                quantity: 0,
                unit: 5,
                unitCost: 175,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Seal basement",
                quantity: 0,
                unit: 2,
                unitCost: 250,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Install sump pump",
                quantity: 0,
                unit: 2,
                unitCost: 1000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Install french drains (estimate depending on condition - length x width)",
                quantity: 0,
                unit: 1,
                unitCost: 25,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Reframe support beam",
                quantity: 0,
                unit: 2,
                unitCost: 500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Replace stairs",
                quantity: 0,
                unit: 2,
                unitCost: 1000,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Interior - Foundation",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Excavation - dig footing trenching",
                quantity: 0,
                unit: 3,
                unitCost: 20,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Excavation - backfill of trenches",
                quantity: 0,
                unit: 3,
                unitCost: 10,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "New foundation - pour concrete footing",
                quantity: 0,
                unit: 3,
                unitCost: 30,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: 'New foundation - pour concrete slab on grade (4" thick)',
                quantity: 0,
                unit: 1,
                unitCost: 4,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "New foundation - pour stem wall for single story house ",
                quantity: 0,
                unit: 3,
                unitCost: 100,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Repair existing foundation -  ($10k min - get quote)",
                quantity: 0,
                unit: 2,
                unitCost: 10000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Repair existing foundation -  stair mud jacking (will vary)",
                quantity: 0,
                unit: 2,
                unitCost: 500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Repair existing foundation - bowing walls support with I beams",
                quantity: 0,
                unit: 2,
                unitCost: 500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Repair existing foundation - settled walls support w/ concrete piers",
                quantity: 0,
                unit: 2,
                unitCost: 850,
                totalCost: 0
              }
            ]
          }
        ]
      },
      {
        selected: false,
        totalCost: 0,
        sectionType: repairEstimateSectionTypes.repairEstimateSectionTypes.MECHANICALS.value,
        subSections: [
          {
            key: uuidv4(),
            selected: false,
            title: "Mechanicals - HVAC",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Gas fired forced hot air heating system, ac system, & ductwork",
                quantity: 0,
                unit: 2,
                unitCost: 6000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Gas fired forced hot air heating system & ductwork",
                quantity: 0,
                unit: 2,
                unitCost: 4000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Gas fired forced hot air unit only ",
                quantity: 0,
                unit: 2,
                unitCost: 1700,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Air conditioning unit only",
                quantity: 0,
                unit: 2,
                unitCost: 2000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Replace forced air ductwork only",
                quantity: 0,
                unit: 2,
                unitCost: 2300,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Replace boiler & hot water baseboard system",
                quantity: 0,
                unit: 2,
                unitCost: 6500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Replace boiler unit only",
                quantity: 0,
                unit: 2,
                unitCost: 3000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Wall heater (install new or remove & replace)",
                quantity: 0,
                unit: 2,
                unitCost: 600,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Service heating & cooling system only",
                quantity: 0,
                unit: 2,
                unitCost: 500,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Mechanicals - Plumbing",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "New plumbing system in entire house (1,500 sq. ft 3/2 bath house)",
                quantity: 0,
                unit: 2,
                unitCost: 7000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Plumbing work in wet locations with fixtures (not replumbing entire house)",
                quantity: 0,
                unit: 2,
                unitCost: 1500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Replace tankless hot water heater",
                quantity: 0,
                unit: 2,
                unitCost: 1500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Replace gas hot water heater - 40 gallon",
                quantity: 0,
                unit: 2,
                unitCost: 600,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Mechanicals - Electrical",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Rewire entire house, new panel, & all lighting fixtures (1,500 sq. ft house)",
                quantity: 0,
                unit: 2,
                unitCost: 7000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Basic electrical work for house & lighting fixtures (1500 sq. ft. house)",
                quantity: 0,
                unit: 2,
                unitCost: 3000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Replace electrical panel only ",
                quantity: 0,
                unit: 2,
                unitCost: 2000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Replace all lighting fixtures only (1500 sq. ft. house)",
                quantity: 0,
                unit: 2,
                unitCost: 2000,
                totalCost: 0
              }
            ]
          }
        ]
      },
      {
        selected: false,
        totalCost: 0,
        sectionType: repairEstimateSectionTypes.repairEstimateSectionTypes.OTHER.value,
        subSections: [
          {
            key: uuidv4(),
            selected: false,
            title: "Other - Demolition & Dumpsters",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Demolition work (cost to fill one 40 yd dumpster)",
                quantity: 0,
                unit: 2,
                unitCost: 500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Dumpster rental (40 yard)",
                quantity: 0,
                unit: 2,
                unitCost: 500,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Other - Termites/Abatement",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Termite fumigation & treatment",
                quantity: 0,
                unit: 4,
                unitCost: 1000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Mold removal & abatement - minimum",
                quantity: 0,
                unit: 4,
                unitCost: 2000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Asbestos removal & abatement - minimum",
                quantity: 0,
                unit: 4,
                unitCost: 1500,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Other - Permits",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Construction permits for remodel (city)",
                quantity: 0,
                unit: 2,
                unitCost: 1500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Construction permits for addition (city)",
                quantity: 0,
                unit: 2,
                unitCost: 5000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Construction permits for deck (city)",
                quantity: 0,
                unit: 2,
                unitCost: 600,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Construction permits over the counter ",
                quantity: 0,
                unit: 2,
                unitCost: 750,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Construction permits for full submittal (county)",
                quantity: 0,
                unit: 2,
                unitCost: 1500,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Construction permits for additition (county)",
                quantity: 0,
                unit: 2,
                unitCost: 5000,
                totalCost: 0
              },
              {
                key: uuidv4(),
                selected: false,
                name: "Construction permits for deck (county)",
                quantity: 0,
                unit: 2,
                unitCost: 600,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Other - Staging",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Staging for (kitchen, baths, living room, & 1 bedroom)",
                quantity: 0,
                unit: 2,
                unitCost: 2000,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Other - Contingency",
            totalCost: 0,
            lineItems: [
              {
                key: uuidv4(),
                selected: false,
                name: "Misc Contingency Cost (10-20% depending on unknowns)",
                quantity: 0,
                unit: 4,
                unitCost: null,
                totalCost: 0
              }
            ]
          },
          {
            key: uuidv4(),
            selected: false,
            title: "Other & Miscellaneous",
            totalCost: 0,
            lineItems: []
          }
        ]
      }
    ]
  };
};

export const setRepairEstimateSqft = (repairEstimate, sqft) => {
  _.each(repairEstimate.sections, function(section) {
    _.each(section.subSections, function(subSection) {
      _.each(subSection.lineItems, function(lineItem) {
        if (lineItem.unit == unitTypes.unitTypes.SQUARE_FEET.value) {
          lineItem.quantity = sqft;
        } else if (lineItem.unit == unitTypes.unitTypes.LUMP_SUM.value || lineItem.unit == unitTypes.unitTypes.EACH.value) {
          lineItem.quantity = 1;
        }
      });
    });
  });
};

export const updateRepairEstimateLineItem = (repairEstimate, key, field, val) => {
  let repairEstimateSection,
    repairEstimateSubSection,
    repairEstimateLineItem = null;

  for (let i = 0; i < repairEstimate.sections.length; i++) {
    repairEstimateSection = repairEstimate.sections[i];
    for (let j = 0; j < repairEstimateSection.subSections.length; j++) {
      repairEstimateSubSection = repairEstimateSection.subSections[j];
      for (let k = 0; k < repairEstimateSubSection.lineItems.length; k++) {
        repairEstimateLineItem = repairEstimateSubSection.lineItems[k];
        if (repairEstimateLineItem.key == key) {
          _.set(repairEstimateLineItem, field, val);

          reconcileRepairEstimateLineItem(repairEstimateLineItem);
          reconcileRepairEstimateSubSection(repairEstimateSubSection);
          reconcileRepairEstimateSection(repairEstimateSection);

          repairEstimate.totalCost = _.sumBy(repairEstimate.sections, function(x) {
            return x.totalCost;
          });
          break;
        }
      }
    }
  }
};

export const addRepairEstimateLineItem = (repairEstimate, key, item) => {
  let repairEstimateSection,
    repairEstimateSubSection,
    repairEstimateLineItem = null;

  for (let i = 0; i < repairEstimate.sections.length; i++) {
    repairEstimateSection = repairEstimate.sections[i];
    for (let j = 0; j < repairEstimateSection.subSections.length; j++) {
      repairEstimateSubSection = repairEstimateSection.subSections[j];

      if (repairEstimateSubSection.key == key) {
        reconcileRepairEstimateLineItem(item);
        repairEstimateSubSection.lineItems.push(item);
        reconcileRepairEstimateSubSection(repairEstimateSubSection);
        reconcileRepairEstimateSection(repairEstimateSection);

        repairEstimate.totalCost = _.sumBy(repairEstimate.sections, function(x) {
          return x.totalCost;
        });
        break;
      }
    }
  }
};

export const reconcileRepairEstimate = (repairEstimate, recurse = false) => {
  if (!repairEstimate.quick) {
    _.each(repairEstimate.sections, function(section) {
      _.each(section.subSections, function(subSection) {
        _.each(subSection.lineItems, function(lineItem) {
          reconcileRepairEstimateLineItem(lineItem);
        });
        reconcileRepairEstimateSubSection(subSection);
      });
      reconcileRepairEstimateSection(section);
    });

    repairEstimate.totalCost = _.sumBy(repairEstimate.sections, function(x) {
      return x.totalCost;
    });
  }
};

export const reconcileRepairEstimateSection = repairEstimateSection => {
  repairEstimateSection.selected = _.some(repairEstimateSection.subSections, function(x) {
    return x.selected;
  });

  if (repairEstimateSection.selected) {
    repairEstimateSection.totalCost = _.sumBy(repairEstimateSection.subSections, function(x) {
      return x.totalCost;
    });
  } else {
    repairEstimateSection.totalCost = 0;
  }
};

export const reconcileRepairEstimateSubSection = repairEstimateSubSection => {
  repairEstimateSubSection.selected = _.some(repairEstimateSubSection.lineItems, function(x) {
    return x.selected;
  });

  if (repairEstimateSubSection.selected) {
    repairEstimateSubSection.totalCost = _.sumBy(repairEstimateSubSection.lineItems, function(x) {
      return x.totalCost;
    });
  } else {
    repairEstimateSubSection.totalCost = 0;
  }
};

export const reconcileRepairEstimateLineItem = repairEstimateLineItem => {
  if (repairEstimateLineItem.selected) {
    repairEstimateLineItem.totalCost = repairEstimateLineItem.quantity * repairEstimateLineItem.unitCost;
  } else {
    repairEstimateLineItem.totalCost = 0;
  }
};
//endregion

//region Comp Functions
export const defaultCompFilter = () => {
  return {
    minBeds: -1,
    maxBeds: -1,
    minSqft: -1,
    maxSqft: -1,
    minLotSqft: -1,
    maxLotSqft: -1,
    minYearBuilt: -1,
    maxYearBuilt: -1,
    minBaths: -1,
    searchDistance: 1
  };
};

export const getBounds = (property, compFilter) => {
  const longitudeOffset = (1 / 49) * compFilter.searchDistance;
  const longitudeRandomOffset = longitudeOffset / 10;

  const maxLon = property.longitude + longitudeOffset;
  const minLon = property.longitude - longitudeOffset;

  const latitudeOffset = (1 / 69) * compFilter.searchDistance;
  const latitudeRandomOffset = longitudeOffset / 10;

  const maxLat = property.latitude + latitudeOffset;
  const minLat = property.latitude - latitudeOffset;

  return {
    maxLon,
    minLon,
    maxLat,
    minLat
  };
};

//region buildZillowCompUrl
export const buildZillowCompUrl = (property, compFilter, currentPage) => {
  let compUrl = "https://www.zillow.com/homes/?searchQueryState=";

  const bounds = getBounds(property, compFilter);
  const searchQueryState = {
    mapBounds: {
      west: bounds.minLon,
      east: bounds.maxLon,
      south: bounds.minLat,
      north: bounds.maxLat
    },
    isListVisible: true,
    filterState: {
      doz: {
        value: "12m"
      },
      sortSelection: {
        value: "days"
      }
    }
  };

  if (currentPage > 1) {
    searchQueryState.pagination = {
      currentPage: currentPage
    };
  }

  addZillowBooleanFilter(searchQueryState, "isRecentlySold", true);
  addZillowBooleanFilter(searchQueryState, "isComingSoon", false);
  addZillowBooleanFilter(searchQueryState, "isCondo", false);
  addZillowBooleanFilter(searchQueryState, "isForSaleByAgent", false);
  addZillowBooleanFilter(searchQueryState, "isForSaleByOwner", false);
  addZillowBooleanFilter(searchQueryState, "isForSaleForeclosure", false);
  addZillowBooleanFilter(searchQueryState, "isLotLand", false);
  addZillowBooleanFilter(searchQueryState, "isMakeMeMove", false);
  addZillowBooleanFilter(searchQueryState, "isManufactured", false);
  addZillowBooleanFilter(searchQueryState, "isMultiFamily", false);
  addZillowBooleanFilter(searchQueryState, "isNewConstruction", false);
  addZillowBooleanFilter(searchQueryState, "isPreMarketForeclosure", false);
  addZillowBooleanFilter(searchQueryState, "isPreMarketPreForeclosure", false);
  addZillowBooleanFilter(searchQueryState, "isTownhouse", false);

  addZillowMinMaxFilter(searchQueryState, "beds", compFilter.minBeds, compFilter.maxBeds);

  addZillowMinMaxFilter(searchQueryState, "baths", compFilter.minBaths, compFilter.maxBaths);

  const sqftRandomOffset = 25;

  addZillowMinMaxFilter(searchQueryState, "sqft", compFilter.minSqft, compFilter.maxSqft);

  addZillowMinMaxFilter(searchQueryState, "lotSize", compFilter.minLotSqft, compFilter.maxLotSqft);

  addZillowMinMaxFilter(searchQueryState, "built", compFilter.minYearBuilt, compFilter.maxYearBuilt);

  compUrl += encodeURIComponent(JSON.stringify(searchQueryState));

  return compUrl;
};

const addZillowMinMaxFilter = (searchQueryState, propName, min, max) => {
  if (min > -1) {
    _.set(searchQueryState, `filterState.${propName}.min`, min);
  }

  if (max > -1) {
    _.set(searchQueryState, `filterState.${propName}.max`, max);
  }
};

const addZillowBooleanFilter = (searchQueryState, propName, val) => {
  _.set(searchQueryState, `filterState.${propName}`, {
    value: val
  });
};
//endregion

//region Redfin Comp Url
export const buildRedfinCompUrl = (property, compFilter, currentPage) => {
  //region Coords
  const bounds = getBounds(property, compFilter);
  //endregion

  // const sqftRandomOffset = 0.02;
  const sqftRandomOffset = 25;

  const urlParameters = [];

  let compUrl = "https://www.redfin.com/city/30772/OR/Portland/filter/";

  urlParameters.push("sort=lo-distance");
  urlParameters.push("property-type=house");

  urlParameters.push(addCompUrlParameter("min-beds", compFilter.minBeds, -1));
  urlParameters.push(addCompUrlParameter("max-beds", compFilter.maxBeds, -1));
  urlParameters.push(addCompUrlParameter("min-baths", compFilter.minBaths, -1));

  urlParameters.push(addCompUrlParameter("min-sqft", compFilter.minSqft + _.random(-sqftRandomOffset, sqftRandomOffset, false), -1));
  urlParameters.push(addCompUrlParameter("max-sqft", compFilter.maxSqft + _.random(-sqftRandomOffset, sqftRandomOffset, false), -1));

  // urlParameters.push(
  //   addCompUrlParameter(
  //     "min-sqft",
  //     compFilter.minSqft + _.random(0, sqftRandomOffset, true),
  //     -1,
  //     formatSqftForUrl,
  //     property.sqft
  //   )
  // );
  // urlParameters.push(
  //   addCompUrlParameter(
  //     "max-sqft",
  //     compFilter.maxSqft + _.random(0, sqftRandomOffset, true),
  //     -1,
  //     formatSqftForUrl,
  //     property.sqft
  //   )
  // );

  urlParameters.push(addCompUrlParameter("min-lot-size", compFilter.minLotSqft, -1, formatSqftForUrl, property.lotSize));
  urlParameters.push(addCompUrlParameter("max-lot-size", compFilter.maxLotSqft, -1, formatSqftForUrl, property.lotSize));
  urlParameters.push(addCompUrlParameter("min-year-built", compFilter.minYearBuilt, -1));
  urlParameters.push(addCompUrlParameter("max-year-built", compFilter.maxYearBuilt, -1));
  urlParameters.push("include=sold-1yr");
  urlParameters.push(`viewport=${bounds.maxLat.toFixed(5)}:${bounds.minLat.toFixed(5)}:${bounds.maxLon.toFixed(5)}:${bounds.minLon.toFixed(5)}`);
  urlParameters.push("no-outline");

  const shuffledUrlParameters = _.shuffle(urlParameters);
  compUrl += _.filter(shuffledUrlParameters, function(i) {
    return i != "";
  }).join(",");

  compUrl += `/page-${currentPage}`;

  return compUrl;
};

const addCompUrlParameter = (paramName, paramValue, ignoreValue = -1, formatFunc = null, formatParam = null) => {
  if (paramValue != ignoreValue) {
    if (formatFunc != null) {
      paramValue = formatFunc(formatParam, paramValue);
    }
    return `${paramName}=${paramValue}`;
  } else {
    return "";
  }
};

const formatSqftForUrl = (val, multiplier) => {
  const adjVal = val + val * multiplier;
  return `${adjVal.toFixed(0)}-sqft`;
};
//endregion
//endregion

//region Misc Functions
export const pause = seconds => {
  return new Promise(r => setTimeout(r, 1000 * seconds));
};

export const writeFile = (fileName, content) => {
  fs.writeFile(fileName, content, err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log(`${fileName} saved.`);
  });
};

export const tryParseNumber = function(str, defaultValue) {
  var retValue = defaultValue;
  if (str !== null) {
    if (str.length > 0) {
      if (!isNaN(str)) {
        retValue = parseFloat(str);
      }
    }
  }
  return retValue;
};
//endregion
