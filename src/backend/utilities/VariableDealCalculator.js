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
  comboLineItems = [];

  rehabIterations = 2;
  rehabMult = 10000;

  roiIterations = 3;
  roiStart = 10;
  roiOffset = 2.5;

  constructor() {}

  async generateDeals(dealAnalysis) {
    this.dealAnalysis = dealAnalysis;

    // const promises = [];
    //
    // promises.push(this.generateRehabDeals());
    // promises.push(this.generateRoiDeals());
    //
    // await Promise.all(promises);

    await this.generateComboLineItems();
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

  async generateComboLineItems() {
    const promises = [];

    promises.push(this.generateLineItem(this.dealAnalysis.DF_RepairCosts, this.dealAnalysis.SNAP_ROI * 100, true));

    for (let i = 0; i < this.roiIterations; i++) {
      const roi = this.roiStart + i * this.roiOffset;

      for (let i = -this.rehabIterations; i < 0; i++) {
        const repairCost = this.dealAnalysis.DF_RepairCosts + i * this.rehabMult;
        promises.push(this.generateLineItem(repairCost, roi, false));
      }

      promises.push(this.generateLineItem(this.dealAnalysis.DF_RepairCosts, roi, false));

      for (let i = 1; i <= this.rehabIterations; i++) {
        const repairCost = this.dealAnalysis.DF_RepairCosts + i * this.rehabMult;
        promises.push(this.generateLineItem(repairCost, roi, false));
      }
    }

    this.comboLineItems = await Promise.all(promises);
  }

  async generateLineItem(repairCosts, roi, actual) {
    const da = Object.assign({}, this.dealAnalysis);
    return new Promise(function(resolve) {
      // console.log(repairCosts, roi);
      const proxy = new DealAnalysisProxy(da);
      proxy.setField([
        {
          field: "DF_RepairCosts",
          val: repairCosts
        },
        {
          field: "SNAP_ROI",
          val: roi
        }
      ]);

      resolve({
        key: uuidv4(),
        purchase: proxy.dealAnalysis.DF_PurchasePrice,
        askDiff: proxy.dealAnalysis.SNAP_DiscountPercent,
        repairCost: proxy.dealAnalysis.DF_RepairCosts,
        roi: proxy.dealAnalysis.SNAP_ROI,
        profit: proxy.dealAnalysis.SNAP_Profit,
        actual
      });
    });
  }

  addLineItem(list, dealAnalysis, actual = false) {
    list.push({
      key: uuidv4(),
      purchase: dealAnalysis.DF_PurchasePrice,
      askDiff: dealAnalysis.SNAP_DiscountPercent,
      repairCost: dealAnalysis.DF_RepairCosts,
      roi: dealAnalysis.SNAP_ROI,
      profit: dealAnalysis.SNAP_Profit,
      actual
    });
  }
}
