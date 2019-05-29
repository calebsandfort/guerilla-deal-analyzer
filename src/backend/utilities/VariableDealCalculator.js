import _ from "lodash";
import DealAnalysisProxy from "./DealAnalysisProxy";
import uuidv4 from "uuid/v4";

export default class VariableDealCalculator {
  //purchase
  //repair cost
  //ROI
  //Profit

  dealAnalysis = null;
  rehabLineItems = [];
  roiLineItems = [];

  rehabIterations = 2;
  rehabMult = 10000;

  roiIterations = 6;
  roiStart = 10;
  roiOffset = 1;

  constructor() {}

  async generateDeals(dealAnalysis) {
    this.dealAnalysis = dealAnalysis;

    const promises = [];

    promises.push(this.generateRehabDeals());
    promises.push(this.generateRoiDeals());

    await Promise.all(promises);

    return;
  }

  async generateRehabDeals() {
    for (let i = -this.rehabIterations; i < 0; i++) {
      const proxy = new DealAnalysisProxy(Object.assign({}, this.dealAnalysis));
      proxy.setField([
        {
          field: "DF_RepairCosts",
          val: this.dealAnalysis.DF_RepairCosts + i * this.rehabMult
        }
      ]);

      this.addLineItem(this.rehabLineItems, proxy.dealAnalysis);
    }

    this.addLineItem(this.rehabLineItems, this.dealAnalysis, true);

    for (let i = 1; i <= this.rehabIterations; i++) {
      const proxy = new DealAnalysisProxy(Object.assign({}, this.dealAnalysis));
      proxy.setField([
        {
          field: "DF_RepairCosts",
          val: this.dealAnalysis.DF_RepairCosts + i * this.rehabMult
        }
      ]);

      this.addLineItem(this.rehabLineItems, proxy.dealAnalysis);
    }
  }

  async generateRoiDeals() {
    for (let i = 0; i < this.roiIterations; i++) {
      const proxy = new DealAnalysisProxy(Object.assign({}, this.dealAnalysis));
      const roi = this.roiStart + i * this.roiOffset;
      proxy.setField([
        {
          field: "SNAP_ROI",
          val: roi
        }
      ]);

      this.addLineItem(this.roiLineItems, proxy.dealAnalysis, Math.floor(this.dealAnalysis.SNAP_ROI * 100) == roi);
    }
  }

  addLineItem(list, dealAnalysis, actual = false) {
    list.push({
      key: uuidv4(),
      purchase: dealAnalysis.DF_PurchasePrice,
      repairCost: dealAnalysis.DF_RepairCosts,
      roi: dealAnalysis.SNAP_ROI,
      profit: dealAnalysis.SNAP_Profit,
      actual
    });
  }
}
