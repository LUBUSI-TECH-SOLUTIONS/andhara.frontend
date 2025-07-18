import { StateCreator } from "zustand"
import { CustomerCoreSlice } from "./customerCoreSlice"
import { CustomerFiltersSlice } from "./customerFIltersSlice"

export interface CustomerPaginationSlice {
  pageIndex: number
  pageSize: number
  pageCount: number

  setPageIndex: (pageIndex: number) => void
  setPageSize: (pageSize: number) => void
  applyPagination: () => void
}

export const createPaginationSlice: StateCreator<
  CustomerCoreSlice & CustomerFiltersSlice & CustomerPaginationSlice,
  [],
  [],
  CustomerPaginationSlice
> = (set, get) => ({
  pageIndex: 0,
  pageSize: 5,
  pageCount: 0,

  setPageIndex: (index) => set({ pageIndex: index }),
  setPageSize: (size) => set({ pageSize: size }),

  applyPagination: () => {
    const { filteredCustomers, pageIndex, pageSize, setDisplayedCustomers } = get()
    
    const start = pageIndex * pageSize
    const end = start + pageSize
    const paginatedCustomers = filteredCustomers.slice(start, end)

    const totalPages = Math.ceil(filteredCustomers.length / pageSize)
    setDisplayedCustomers(paginatedCustomers)
    set({ pageCount: totalPages })
  }
  
})