import { dashboardDetailService } from "@/features/dashboardDetail/service/dashboardDetailService";
import { SalesReport, SalesReportParams } from "@/features/dashboardDetail/types/incomesTypes";
import { create } from "zustand";
interface IncomeState {
  incomes: SalesReport[];
  skip: number;
  limit: number;
  isLoading: boolean;
  hasMore: boolean;
  totalRecords: number;

  filters: SalesReportParams;

  fetchIncomes: (opts?: { reset?: boolean }) => Promise<void>;
  fetchNext: () => Promise<void>;
  setFilters: (filters: Partial<SalesReportParams>, opts?: { reset?: boolean }) => Promise<void>;
  resetFilters: () => void;

  expandedRows: Set<string>;
  expandAll: boolean;
  toggleRow: (key: string) => void;
  toggleExpandAll: () => void;

  reset: () => void;
}

export const incomesStore = create<IncomeState>((set, get) => ({
  incomes: [],
  skip: 0,
  limit: 20,
  isLoading: false,
  hasMore: true,
  totalRecords: 0,

  filters: {},

  expandedRows: new Set(),
  expandAll: false,

  fetchIncomes: async ({ reset } = { reset: false }) => {
    const { skip: currentSkip, limit, incomes, isLoading, hasMore, filters } = get();
    const skip = reset ? 0 : currentSkip;

    if (isLoading) return;
    if (!reset && !hasMore) return;

    set({ isLoading: true });

    try {
      const params = { skip, limit, ...filters };

      const response = await dashboardDetailService.getIncomes(params);
      const newIncomes = response.data || [];

      const combined = reset ? newIncomes : [...incomes, ...newIncomes];

      set({
        incomes: combined,
        skip: skip + limit,
        hasMore: newIncomes.length === (limit + 1),
        totalRecords: response.data.length ?? combined.length,
      });
    } catch (error: any) {
      console.error("Error fetching incomes:", error);
      set({
        hasMore: false
      });
      throw new Error(error?.message || "Error al obtener los ingresos");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNext: async () => {
    await get().fetchIncomes({ reset: false });
  },

  setFilters: async (newFilters: Partial<SalesReportParams>, { reset } = { reset: true }) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));

    if (reset) {
      set({
        incomes: [],
        skip: 0,
        hasMore: true,
        totalRecords: 0,
      });
      await get().fetchIncomes({ reset: true });
    }
  },

  resetFilters: async () => {
    set({
      filters: {
        id_branch: undefined,
        month: undefined,
        year: undefined,
        start_date: undefined,
        end_date: undefined
      }
    });
    await get().fetchIncomes({ reset: true });
    set({
      incomes: [],
      skip: 0,
      hasMore: true,
      totalRecords: 0,
      expandedRows: new Set(),
      expandAll: false,
    });
  },

  toggleRow: (key: string) => {
    set((state) => {
      const newExpandedRows = new Set(state.expandedRows);
      if (newExpandedRows.has(key)) {
        newExpandedRows.delete(key);
      } else {
        newExpandedRows.add(key);
      }
      return { expandedRows: newExpandedRows };
    });
  },

  toggleExpandAll: () => {
    set((state) => {
      if (state.expandAll) {
        return { expandedRows: new Set(), expandAll: false };
      } else {
        const allKeys = state.incomes.map(
          (sale, index) => `${sale.date}|${sale.location}|${index}`
        );
        return { expandedRows: new Set(allKeys), expandAll: true };
      }
    });
  },

  reset: () => {
    set({
      incomes: [],
      skip: 0,
      isLoading: false,
      hasMore: true,
      totalRecords: 0,
      expandedRows: new Set(),
      expandAll: false,
      filters: {},
    });
  },
}));
