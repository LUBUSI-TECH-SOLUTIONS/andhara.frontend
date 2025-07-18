import { Customer } from "@/features/customer/types/customerTypes";
import { StateCreator } from "zustand";
import { CustomerCoreSlice } from "./customerCoreSlice";
import { CustomerActionsSlice } from "./customerActionsSlice";

export interface CustomerDialogSlice {
  isNewDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isPurchaseSheetOpen: boolean;

  openNewDialog: () => void;
  closeNewDialog: () => void;

  openEditDialog: (customer: Customer) => void;
  closeEditDialog: () => void;

  openPurchaseSheet: (customer: Customer) => void;
  closePurchaseSheet: () => void;
}

export const createDialogSlice: StateCreator<
  CustomerDialogSlice & 
  CustomerCoreSlice & 
  CustomerActionsSlice,
  [],
  [],
  CustomerDialogSlice
> = (set, get) => ({
  isNewDialogOpen: false,
  isEditDialogOpen: false,
  isPurchaseSheetOpen: false,

  openNewDialog: () => set({ isNewDialogOpen: true }),
  closeNewDialog: () => set({ isNewDialogOpen: false }),

  openEditDialog: (customer) => {
    const { setSelectedCustomer } = get();
    set({isEditDialogOpen: true })
    setSelectedCustomer(customer);
  },
  
  closeEditDialog: () => {
    const { setSelectedCustomer } = get();
    set({ isEditDialogOpen: false })
    setSelectedCustomer(null);
  },

  openPurchaseSheet: async (customer) => {
    const { setSelectedCustomer, fetchCustomerPurchases, setIsLoading, setError } = get();
    setIsLoading(true);
    try{
      await fetchCustomerPurchases(customer.customer_document);
    }catch (error: any) {
      setError(error.message || "Error al cargar las compras del cliente");
    }finally {
      setIsLoading(false);
    }
    set({ isPurchaseSheetOpen: true })
    setSelectedCustomer(customer);
  },
  
  closePurchaseSheet: () => {
    const { setSelectedCustomer } = get();
    set({ isPurchaseSheetOpen: false })
    setSelectedCustomer(null);
  }
})
