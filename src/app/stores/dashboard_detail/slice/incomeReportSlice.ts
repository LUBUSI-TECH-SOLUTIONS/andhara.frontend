import { StateCreator } from "zustand";
import { IncomeCoreSlice } from "./incomeCoreSlice";
import { reportsService } from "@/features/dashboardDetail/service/reportsService";

export interface IncomeReportSlice {
  fetchReports: (opts?: { reset?: boolean }) => Promise<void>;
  resetReports: () => void;
}

export const createIncomeReportSlice: StateCreator<
  IncomeReportSlice &
  IncomeCoreSlice
> = (set, get) => ({
  ...get(),
  fetchReports: async () => {
    const { filters, isLoading } = get();
    if (isLoading) return
    set({ isLoading: true })

    try {
      const params = { ...filters };
      const response = await reportsService.getGlobalReport(params);
      set({
        reports: response.data || null,
      })
    } catch (error: any) {
      console.error("Error fetching reports:", error);
    } finally {
      set({ isLoading: false })
    }
  },
})