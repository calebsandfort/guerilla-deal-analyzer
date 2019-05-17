import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    dealAnalyses(offset: Int, limit: Int, order: String): [DealAnalysis!]
    dealAnalysesQueryable(query: EntityQuery): [DealAnalysis!]
    dealAnalysis(id: ID!): DealAnalysis
  }
  extend type Mutation {
    createDealAnalysis(input: DealAnalysisInput!): DealAnalysis!
    updateDealAnalysis(id: ID!, input: DealAnalysisInput!): DealAnalysis!
    deleteDealAnalysis(id: ID!): Boolean!
  }
  type DealAnalysis {
    id: ID!
    DF_ARV: Float
    DF_Ask: Float
    DF_RepairCosts: Float
    DF_PurchasePrice: Float
    DF_HoldTime: Int

    PVP_TotalCost: Float

    HC_PropertyTaxesAnnually: Float
    HC_PropertyTaxesMonthly: Float
    HC_InsuranceAnnually: Float
    HC_InsuranceMonthly: Float
    HC_HOAMonthly: Float
    HC_Gas: Float
    HC_Water: Float
    HC_Electricity: Float
    HC_OtherUtilities: Float
    HC_UtilitiesMonthly: Float
    HC_MiscMonthly: Float
    HC_TotalCostMonthly: Float
    HC_TotalCost: Float

    FC_LoanType: Int
    FC_LoanAmount: Float

    FC_FirstMortgageAmount: Float
    FC_FirstMortgagePoints: Float
    FC_FirstMortgageInterest: Float
    FC_FirstMortgageAmount_Cost: Float
    FC_FirstMortgagePoints_Cost: Float
    FC_FirstMortgageInterest_Cost: Float
    FC_FirstMortgagePayment: Float

    FC_SecondMortgageAmount: Float
    FC_SecondMortgagePoints: Float
    FC_SecondMortgageInterest: Float
    FC_SecondMortgageAmount_Cost: Float
    FC_SecondMortgagePoints_Cost: Float
    FC_SecondMortgageInterest_Cost: Float
    FC_SecondMortgagePayment: Float

    FC_MiscMortgageAmount: Float
    FC_MiscMortgagePoints: Float
    FC_MiscMortgageInterest: Float
    FC_MiscMortgageAmount_Cost: Float
    FC_MiscMortgagePoints_Cost: Float
    FC_MiscMortgageInterest_Cost: Float
    FC_MiscMortgagePayment: Float

    FC_MiscCost: Float
    FC_TotalCost: Float

    BTC_TitleInsuranceSearch: Float
    BTC_TitleInsuranceSearch_Cost: Float
    BTC_EscrowAttorney: Float
    BTC_Misc: Float
    BTC_TotalCost: Float

    STC_RealtorFees: Float
    STC_RealtorFees_Cost: Float
    STC_TransferConveyenceFees: Float
    STC_TransferConveyenceFees_Cost: Float
    STC_Misc: Float
    STC_Staging: Float
    STC_EscrowAttorney: Float
    STC_SellingRecording: Float
    STC_HomeWarranty: Float
    STC_Marketing: Float
    STC_TotalCost: Float

    SNAP_Profit: Float
    SNAP_ROI: Float
    SNAP_DownPayment: Float
    SNAP_CommittedCapital: Float
  }
  input DealAnalysisInput {
    DF_ARV: Float
    DF_Ask: Float
    DF_RepairCosts: Float
    DF_PurchasePrice: Float
    DF_HoldTime: Int

    PVP_TotalCost: Float

    HC_PropertyTaxesAnnually: Float
    HC_PropertyTaxesMonthly: Float
    HC_InsuranceAnnually: Float
    HC_InsuranceMonthly: Float
    HC_HOAMonthly: Float
    HC_Gas: Float
    HC_Water: Float
    HC_Electricity: Float
    HC_OtherUtilities: Float
    HC_UtilitiesMonthly: Float
    HC_MiscMonthly: Float
    HC_TotalCostMonthly: Float
    HC_TotalCost: Float

    FC_LoanType: Int

    FC_FirstMortgageAmount: Float
    FC_FirstMortgagePoints: Float
    FC_FirstMortgageInterest: Float
    FC_FirstMortgageAmount_Cost: Float
    FC_FirstMortgagePoints_Cost: Float
    FC_FirstMortgageInterest_Cost: Float
    FC_FirstMortgagePayment: Float

    FC_SecondMortgageAmount: Float
    FC_SecondMortgagePoints: Float
    FC_SecondMortgageInterest: Float
    FC_SecondMortgageAmount_Cost: Float
    FC_SecondMortgagePoints_Cost: Float
    FC_SecondMortgageInterest_Cost: Float
    FC_SecondMortgagePayment: Float

    FC_MiscMortgageAmount: Float
    FC_MiscMortgagePoints: Float
    FC_MiscMortgageInterest: Float
    FC_MiscMortgageAmount_Cost: Float
    FC_MiscMortgagePoints_Cost: Float
    FC_MiscMortgageInterest_Cost: Float
    FC_MiscMortgagePayment: Float

    FC_MiscCost: Float
    FC_TotalCost: Float

    BTC_TitleInsuranceSearch: Float
    BTC_TitleInsuranceSearch_Cost: Float
    BTC_EscrowAttorney: Float
    BTC_Misc: Float
    BTC_TotalCost: Float

    STC_RealtorFees: Float
    STC_RealtorFees_Cost: Float
    STC_TransferConveyenceFees: Float
    STC_TransferConveyenceFees_Cost: Float
    STC_Misc: Float
    STC_Staging: Float
    STC_EscrowAttorney: Float
    STC_SellingRecording: Float
    STC_HomeWarranty: Float
    STC_Marketing: Float
    STC_TotalCost: Float

    SNAP_Profit: Float
    SNAP_ROI: Float
    SNAP_DownPayment: Float
    SNAP_CommittedCapital: Float
  }
`;
