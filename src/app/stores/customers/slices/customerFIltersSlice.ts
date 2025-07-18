import { CustomerTableFilters } from "@/features/customer/types/customerTypes";
import { StateCreator } from "zustand";
import { CustomerCoreSlice } from "./customerCoreSlice";
import { SortOption } from "@/lib/utils";
import debounce from "lodash.debounce";
import { filterByBranch, filterByDocumentType } from "@/app/stores/customers/utils/customerFilters";
import { CustomerPaginationSlice } from "./customerPaginationSlice";

export interface CustomerFilters {
  search: string;
  filters: CustomerTableFilters;
  sort: SortOption | undefined;
  total: number;
}

export interface CustomerFiltersSlice extends CustomerFilters {
  setSearch: (search: string) => void;
  setFilters: (filters: Partial<CustomerTableFilters>) => void;
  setTotal: (total: number) => void;
  setSearchWithDebounce: (search: string) => void;
  applyFilters: () => void;
  setSort: (sort: SortOption | undefined) => void;
  clearFilters: () => void;
}

const initialFilters: CustomerTableFilters = {
  document_type: null,
  customer_address: null,
  customer_document: null,
  customer_email: null,
  customer_name: null,
  customer_phone: null,
  branch: null,
  customer_state: null,
  minPurchase: null,
  maxPurchase: null,
  minDuration: null,
  maxDuration: null,
}

export const createFilterSlice: StateCreator<
  CustomerFiltersSlice & 
  CustomerCoreSlice & 
  CustomerPaginationSlice,
  [],
  [],
  CustomerFiltersSlice
> = (set, get) => ({
  search: "",
  filters: { ...initialFilters },
  sort: undefined,
  total: 0,

  setSearch: (value) => set({ search: value }),
  setFilters: (newFilter) => {
    console.log("Setting filters:", newFilter);
    const { filters, applyFilters } = get();
    const updatedFilters = { ...filters, ...newFilter };

    set({ filters: updatedFilters });
    applyFilters();
  },
  setSearchWithDebounce: (search) => {
    const { setSearch } = get();
    setSearch(search);
    debouncedSearch(search, set, get)
  },
  setSort: (sort) => {
    set({ sort });
    const { applyFilters } = get();
    applyFilters();
  },
  setTotal: (total) => set({ total }),
  applyFilters: () => {
    const { 
      allCustomers, 
      filters, 
      setFilteredCustomers,
      applyPagination,
    } = get();
    let filtered = [...allCustomers];

    filtered = filterByDocumentType(filtered, filters.document_type || "") || [];
    filtered = filterByBranch(filtered, filters.branch) || [];

    setFilteredCustomers(filtered);
    applyPagination();
  },
  clearFilters: () => {
    set({ search: "", filters: { ...initialFilters }, sort: undefined });
    const { applyFilters } = get();
    applyFilters();
  },

})

const debouncedSearch = debounce(async (search: string, set: any, get: any) => {
  set({ isLoading: true })
  try {
    const result = await get().fetchCustomers({ search })
    if (!Array.isArray(result)) {
      set({ error: "Error fetching customers" })
      return
    }
    set({ filteredCustomers: result, isLoading: false })
  } catch (error) {
    set({ error: "Error fetching customers" })
  }
}, 500) 