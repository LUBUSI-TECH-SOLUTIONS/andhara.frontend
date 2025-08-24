import { SalesDashboardResponse, SalesReport, SalesReportParams } from "@/features/dashboardDetail/types/incomesTypes";
import { StateCreator } from "zustand";

export interface IncomeCoreSlice {
  incomes: SalesReport[];
  reports: SalesDashboardResponse | null;
  skip: number;
  limit: number;
  isLoading: boolean;
  hasMore: boolean;
  totalRecords: number;
  filters: SalesReportParams;
}

export const createIncomeCoreSlice: StateCreator<IncomeCoreSlice> = () => ({
  incomes: [],
  reports: null,
  skip: 0,
  limit: 20,
  isLoading: false,
  hasMore: true,
  totalRecords: 0,
  filters:{}
})