import { IncomeCoreSlice } from "./incomeCoreSlice";
import { StateCreator } from "zustand";
import { IncomeActionsSlice } from "./incomeActionsSlice";
import { IncomeReportSlice } from "./incomeReportSlice";

export interface IncomeFilterSlice {
  setFilters: (
    filters: Partial<IncomeCoreSlice["filters"]>,
    opts?: { reset?: boolean }
  ) => Promise<void>;
  resetFilters: () => Promise<void>;
}

export const createIncomeFilterSlice: StateCreator<
  IncomeCoreSlice &
  IncomeActionsSlice &
  IncomeReportSlice &
  IncomeFilterSlice
> = (set, get) => ({
  ...get(),
  setFilters: async (newFilters, { reset } = { reset: true }) => {
    set((state) => ({
      ...state,
      filters: { ...state.filters, ...newFilters }
    }))

    if (reset) {
      set((state) => ({
        ...state,
        incomes: [],
        skip: 0,
        hasMore: true,
        totalRecords: 0,
      }))
      await get().fetchIncomes({ reset: true });
      await get().fetchReports();
    }
  },

  resetFilters: async () => {
    set((state) => ({
      ...state,
      filters: {
        id_branch: undefined,
        month: undefined,
        year: undefined,
        start_date: undefined,
        end_date: undefined,
      },
      incomes: [],
      skip: 0,
      hasMore: true,
      totalRecords: 0,
    }))
    await get().fetchIncomes({ reset: true });
    await get().fetchReports();
  }
})