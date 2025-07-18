import { Customer, CustomerPurchase } from "@/features/customer/types/customerTypes";
import { StateCreator } from "zustand";

export interface CustomerCoreSlice {
  allCustomers: Customer[];
  filteredCustomers: Customer[];
  displayedCustomers: Customer[];
  selectedCustomer: Customer | null;
  customerPurchase: CustomerPurchase | null;
  isLoading: boolean;
  error: string | null;

  setAllCustomers: (customers: Customer[]) => void;
  setFilteredCustomers: (customers: Customer[]) => void;
  setDisplayedCustomers: (customers: Customer[]) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setCustomerPurchase: (purchase: CustomerPurchase | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const createCoreSlice: StateCreator<
  CustomerCoreSlice, [], [], CustomerCoreSlice
> = (set) => ({
  allCustomers: [],
  filteredCustomers: [],
  displayedCustomers: [],

  selectedCustomer: null,
  customerPurchase: null,

  isLoading: false,
  error: null,

  setAllCustomers: (customers) => set({ allCustomers: customers }),
  setFilteredCustomers: (customers) => set({ filteredCustomers: customers }),
  setDisplayedCustomers: (customers) => set({ displayedCustomers: customers }),
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  setCustomerPurchase: (purchase) => set({ customerPurchase: purchase }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (message) => set({ error: message })
})