import { dashboardDetailService } from "@/features/dashboardDetail/service/dashboardDetailService";
import { SalesReport } from "@/features/dashboardDetail/types/incomesTypes";
import { create } from "zustand";

interface IncomeState {
  incomes: SalesReport[];
  skip: number;
  limit: number;
  isLoading: boolean;
  hasMore: boolean;
  totalRecords?: number;
  currentPage?: number;
  totalPages?: number;
  expandedRows?: Set<string>;
  expandAll?: boolean;

  fetchIncomes: () => Promise<void>;
  toggleRow: (key: string) => void;
  toggleExpandAll: () => void;
  reset: () => void;
}

export const incomesStore = create<IncomeState>((set, get) => ({
  incomes: [],
  skip: 0,
  limit: 10,
  isLoading: false,
  hasMore: true,
  totalRecords: 0,
  currentPage: 1,
  totalPages: 1,
  expandedRows: new Set(),
  expandAll: false,

  fetchIncomes: async () => {
    const { skip, limit, incomes, isLoading, hasMore } = get();
    if (isLoading || !hasMore) return;

    set({ isLoading: true });
    try {
      const response = await dashboardDetailService.getIncomes({
        skip,
        limit,
      });
      const newIncomes = response.data || [];
      set({
        incomes: [...incomes, ...newIncomes],
        skip: skip + limit,
        hasMore: newIncomes.length === limit,
        totalRecords: response.data?.length || 0,
        currentPage: Math.floor((skip + limit) / limit),
        totalPages: Math.ceil(response.data.length / limit),
      });
    } catch (error: any) {
      console.error("Error fetching incomes:", error);
      throw new Error(error.message || "Error al obtener los ingresos");
    }finally{
      set({ isLoading: false });
    }
  },
  toggleRow: (key: string) => {
    set((state) => {
      const newExpandedRows = new Set(state.expandedRows)
      if (newExpandedRows.has(key)) {
        newExpandedRows.delete(key)
      } else {
        newExpandedRows.add(key)
      }
      return { expandedRows: newExpandedRows }
    })
  },

  toggleExpandAll: () => {
    set((state) => {
      if (state.expandAll) {
        return { expandedRows: new Set(), expandAll: false }
      } else {
        const allKeys = state.incomes.map((sale, index) => `${sale.date}-${sale.location}-${index}`)
        return { expandedRows: new Set(allKeys), expandAll: true }
      }
    })
  },

  reset: () => {
    set({
      incomes: [],
      skip: 0,
      isLoading: false,
      hasMore: true,
      totalRecords: 0,
      currentPage: 1,
      totalPages: 1,
      expandedRows: new Set(),
      expandAll: false,
    })
  },
  
}))