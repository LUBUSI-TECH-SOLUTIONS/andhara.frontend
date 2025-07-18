import { CustomerRequest } from "@/features/customer/types/customerTypes";
import { StateCreator } from "zustand";
import { CustomerCoreSlice } from "./customerCoreSlice";
import { CustomerFiltersSlice } from "./customerFIltersSlice";
import { CustomerPaginationSlice } from "./customerPaginationSlice";
import { CustomerDialogSlice } from "./customerDialogSlice";
import { CustomerService } from "@/features/customer/services/customerService";

export interface CustomerActionsSlice {
  fetchCustomers: (
    params?: {
      search?: string;
      skip?: number;
      limit?: number;
      pageIndex?: number;
      pageSize?: number;
    }) => Promise<void>;
  fetchCustomerByDocument: (document: string) => Promise<void>;
  fetchCustomerPurchases: (document: string) => Promise<void>;
  createCustomer: (data: CustomerRequest) => Promise<void>;
  updateCustomer: (data: CustomerRequest) => Promise<void>;
  toggleCustomerStatus: (document: string) => Promise<void>;
}

export const createActionsSlice: StateCreator<
  CustomerCoreSlice &
  CustomerFiltersSlice &
  CustomerPaginationSlice &
  CustomerDialogSlice &
  CustomerActionsSlice,
  [],
  [],
  CustomerActionsSlice
> = (_ , get) => ({
  fetchCustomers: async (params) => {
    const {
      setIsLoading,
      setError,
      setAllCustomers,
      applyFilters,
      applyPagination,
      setTotal,
      search,
      pageIndex,
      pageSize,
    } = get();

    try {
      setIsLoading(true);
      const data = await CustomerService.getCustomers(
        {
          search: params?.search || search,
          skip: (params?.pageIndex || pageIndex) * (params?.pageSize || pageSize),
          limit: params?.pageSize || pageSize,
        }
      );
      setAllCustomers(data.data || []);
      applyFilters();
      applyPagination();
      setTotal(data.data.length);
    } catch (error: any) {
      setError(error.message || "Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  },

  fetchCustomerByDocument: async (document) => {
    const { setIsLoading, setError, setSelectedCustomer } = get();

    try {
      setIsLoading(true);
      const customers = await CustomerService.getCustomers({
        search: document,
        skip: 0,
        limit: 1,
      });
      if (customers.data && customers.data.length > 0) {
        const foundCustomer = customers.data.find(c => c.customer_document === document);
        if (foundCustomer) {
          setSelectedCustomer(foundCustomer);
        }
      }
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to fetch customer");
    } finally {
      setIsLoading(false);
    }
  },

  fetchCustomerPurchases: async (document) => {
    const { setIsLoading, setError, setCustomerPurchase } = get();
    setIsLoading(true);

    try {
      const response = await CustomerService.getCustomerPurchase(document);  
      setCustomerPurchase(response.data);
    } catch (error: any) {
      setError(error.message || "Failed to fetch customer purchases");
    } finally {
      setIsLoading(false);
    }
  },

  createCustomer: async (data) => {
    const {
      fetchCustomers,
      closeNewDialog,
      setError,
      setIsLoading,
      applyFilters
    } = get()

    try {
      setIsLoading(true);
      await CustomerService.createCostumer(data);
      setError(null);
      closeNewDialog();
    } catch (error: any) {
      setError(error.message || "Failed to create customer");
    } finally {
      setIsLoading(false);
      applyFilters();
      await fetchCustomers();
    }
  },

  updateCustomer: async (data) => {
    const {
      fetchCustomers,
      closeEditDialog,
      setError,
      setIsLoading,
      applyFilters
    } = get()

    try {
      setIsLoading(true);
      await CustomerService.updateCustomer(data);
      setError(null);
      closeEditDialog();
    } catch (error: any) {
      setError(error.message || "Failed to update customer");
    } finally {
      setIsLoading(false);
      applyFilters();
      await fetchCustomers();
    }
  },

  toggleCustomerStatus: async (document) => {
    const {
      fetchCustomers,
      setError,
      setIsLoading,
      applyFilters
    } = get();

    try {
      setIsLoading(true);
      await CustomerService.toggleCustomer(document);
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to toggle customer status");
    } finally {
      setIsLoading(false);
      applyFilters();
      await fetchCustomers();
    }
  },

})