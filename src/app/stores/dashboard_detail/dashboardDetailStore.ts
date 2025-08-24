import { create } from "zustand";
import { createIncomeActionsSlice, IncomeActionsSlice } from "./slice/incomeActionsSlice";
import { createIncomeCoreSlice, IncomeCoreSlice } from "./slice/incomeCoreSlice";
import { createIncomeExpansionSlice, IncomeExpansionSlice } from "./slice/incomeExpansionSlice";
import { createIncomeFilterSlice, IncomeFilterSlice } from "./slice/incomeFilterSlice";
import { createIncomeReportSlice, IncomeReportSlice } from "./slice/incomeReportSlice";

type IncomesStoreState = 
  IncomeCoreSlice &
  IncomeFilterSlice &
  IncomeActionsSlice &
  IncomeReportSlice &
  IncomeExpansionSlice;

export const incomesStore = create<IncomesStoreState>()((...a) => ({
  ...createIncomeCoreSlice(...a),
  ...createIncomeActionsSlice(...a),
  ...createIncomeFilterSlice(...a),
  ...createIncomeExpansionSlice(...a),
  ...createIncomeReportSlice(...a),
}))
