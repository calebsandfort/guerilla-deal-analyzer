import DealWizardStore from "@/store/modules/deal-wizard";

describe("DealWizardStore", () => {
  describe("mutations", () => {
    it("should set showCompFilterDialog as specified", () => {
      const state = {
        showCompFilterDialog: false
      };

      DealWizardStore.mutations.setShowCompFilterDialog(state, true);

      expect(state.showCompFilterDialog).toBeTruthy();

      DealWizardStore.mutations.setShowCompFilterDialog(state, false);

      expect(state.showCompFilterDialog).toBeFalsy();
    });
  });
});
