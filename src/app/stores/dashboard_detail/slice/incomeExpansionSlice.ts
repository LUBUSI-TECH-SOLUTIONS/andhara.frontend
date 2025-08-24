import { StateCreator } from "zustand";
import { IncomeCoreSlice } from "./incomeCoreSlice";
import { IncomeFilterSlice } from "./incomeFilterSlice";

export interface IncomeExpansionSlice {
  expandedRows: Set<string>;
  expandAll: boolean;
  toggleRow: (key: string) => void;
  toggleExpandAll: () => void;
}

export const createIncomeExpansionSlice: StateCreator<
  IncomeExpansionSlice &
  IncomeCoreSlice &
  IncomeFilterSlice
> = (set, get) => ({
  ...get(),

  expandedRows: new Set<string>(),
  expandAll: false,

  toggleRow: (key: string) => {
    set((state) => {
      const newExpandedRows = new Set(state.expandedRows);
      if (newExpandedRows.has(key)) {
        newExpandedRows.delete(key);
      } else {
        newExpandedRows.add(key);
      }
      return { ...state, expandedRows: newExpandedRows };
    });
  },

  toggleExpandAll: () => {
    set((state) => {
      if (state.expandAll) {
        return { ...state, expandAll: false, expandedRows: new Set<string>() };
      } else {
        const allKeys = state.incomes.map(
          (sale, index) => `${sale.date}|${sale.location}|${index}`
        );
        return { ...state, expandAll: true, expandedRows: new Set<string>(allKeys) };
      }
    });
  }
});