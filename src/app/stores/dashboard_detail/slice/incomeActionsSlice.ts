import { StateCreator } from "zustand";
import { IncomeCoreSlice } from "./incomeCoreSlice";
import { dashboardDetailService } from "@/features/dashboardDetail/service/dashboardDetailService";
import { SalesReport } from "@/features/dashboardDetail/types/incomesTypes";

export interface IncomeActionsSlice {
  fetchIncomes: (opts?: { reset?: boolean }) => Promise<void>;
  fetchNext: () => Promise<void>;
  reset: () => void;
}

export const createIncomeActionsSlice: StateCreator<
  IncomeActionsSlice &
  IncomeCoreSlice
> = (set, get) => ({
  // IncomeCoreSlice properties with initial values
  ...get(),
  incomes: [],
  skip: 0,
  limit: 20,
  isLoading: false,
  hasMore: true,
  totalRecords: 0,
  filters: {},

  fetchIncomes: async ({ reset } = { reset: false }) => {
    const { skip: currentSkip, limit, incomes, isLoading, hasMore, filters } = get();
    const skip = reset ? 0 : currentSkip;

    if (isLoading) return
    if (!hasMore && !reset) return

    set({ isLoading: true })

    try {
      const params = { skip, limit, ...filters };
      const response = await dashboardDetailService.getIncomes(params);
      const newIncomes: SalesReport[] = response.data || [];

      const combined = reset ? newIncomes : [...incomes, ...newIncomes];

      set({
        incomes: combined,
        skip: skip + newIncomes.length,
        hasMore: newIncomes.length === (limit + 1),
        totalRecords: response.data.length ?? combined.length,
      })
    } catch (error: any) {
      console.error("Error fetching incomes:", error);
      set({ hasMore: false });
    } finally {
      set({ isLoading: false })
    }
  },

  fetchNext: async () => {
    await get().fetchIncomes({ reset: false });
  },

  reset: () => {
    set({
      incomes: [],
      skip: 0,
      isLoading: false,
      hasMore: true,
      totalRecords: 0,
      filters: {},
    });
  },
})