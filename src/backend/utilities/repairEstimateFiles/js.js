String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

var repairEstimateSectionTypes = {
  repairEstimateSectionTypes: {
    NONE: {
      value: 0,
      display: "None"
    },
    EXTERIOR: {
      value: 1,
      display: "Exterior"
    },
    INTERIOR: {
      value: 2,
      display: "Interior"
    },
    MECHANICALS: {
      value: 3,
      display: "Mechanicals"
    },
    OTHER: {
      value: 4,
      display: "Other"
    }
  }
};

$(function() {
  var repairEstimate = {
    title: "Repair Estimate",
    totalCost: 50000,
    quick: true,
    sections: []
  };

  var exteriorSection = {
    selected: false,
    totalCost: 0,
    sectionType:
      "|repairEstimateSectionTypes.repairEstimateSectionTypes.EXTERIOR.value|",
    subSections: []
  };

  var interiorSection = {
    selected: false,
    totalCost: 0,
    sectionType:
      "|repairEstimateSectionTypes.repairEstimateSectionTypes.INTERIOR.value|",
    subSections: []
  };

  var mechanicalsSection = {
    selected: false,
    totalCost: 0,
    sectionType:
      "|repairEstimateSectionTypes.repairEstimateSectionTypes.MECHANICALS.value|",
    subSections: []
  };

  var otherSection = {
    selected: false,
    totalCost: 0,
    sectionType:
      "|repairEstimateSectionTypes.repairEstimateSectionTypes.OTHER.value|",
    subSections: []
  };

  var rows = $(".repair-table > tbody > tr");
  var unitTypes = [];

  for (var i = 0; i < rows.length; i += 2) {
    var headerRow = $(rows[i]);
    var tableRow = $(rows[i + 1]);

    var subSectionDescription = headerRow.find(".itemnametext").text();

    var repairSection = {
      key: "|uuidv4()|",
      selected: false,
      title: subSectionDescription,
      totalCost: 0,
      lineItems: []
    };

    var estimateTable = tableRow.find(".estimate-table");
    var lineItemRows = estimateTable.find("> tbody > tr");

    for (var j = 0; j < lineItemRows.length - 1; j++) {
      var cells = $(lineItemRows[j]).children("td");

      var repairType = $(cells[0])
        .find(".itemnametext")
        .text();
      var unit = $(cells[2])
        .find(".unit")
        .text();
      var unitCost = $(cells[3])
        .find("input[data-role=numerictextbox]")
        .attr("aria-valuenow");

      if (!unitTypes.includes(unit)) {
        unitTypes.push(unit);
      }

      var unitType = 0;

      switch (unit) {
        case "Square Feet":
          unitType = 1;
          break;
        case "Each":
          unitType = 2;
          break;
        case "Linear Feet":
          unitType = 3;
          break;
        case "Lump Sum":
          unitType = 4;
          break;
        case "Square Yards":
          unitType = 5;
          break;
      }

      var repairEstimateLineItem = {
        key: "|uuidv4()|",
        selected: false,
        name: repairType,
        quantity: 0,
        unit: unitType,
        unitCost: parseFloat(unitCost),
        totalCost: 0
      };

      repairSection.lineItems.push(repairEstimateLineItem);
    }

    if (subSectionDescription.indexOf("Exterior - ") > -1) {
      exteriorSection.subSections.push(repairSection);
    } else if (subSectionDescription.indexOf("Interior - ") > -1) {
      interiorSection.subSections.push(repairSection);
    } else if (subSectionDescription.indexOf("Mechanicals - ") > -1) {
      mechanicalsSection.subSections.push(repairSection);
    } else if (subSectionDescription.indexOf("Other - ") > -1) {
      otherSection.subSections.push(repairSection);
    }
  }

  repairEstimate.sections.push(exteriorSection);
  repairEstimate.sections.push(interiorSection);
  repairEstimate.sections.push(mechanicalsSection);
  repairEstimate.sections.push(otherSection);

  //console.log(unitTypes)
  console.log(JSON.stringify(repairEstimate));
});
