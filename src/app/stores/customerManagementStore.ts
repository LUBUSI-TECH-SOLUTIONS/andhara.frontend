import { customerManagementService } from "@/features/dashboard/service/customerService";
import { CustomerManagement, CustomerService, CustomerServiceById } from "@/features/dashboard/types/purchaseTypes";
import { create } from "zustand";

interface CustomerManagementStore {
  customerManagementList: CustomerService[];
  selectedService: CustomerServiceById;
  isLoading: boolean;
  error: string | null;
  isOpenManagement: boolean;
  customerServiceId: string;

  fetchCustomerManagementList: () => Promise<void>;
  fetchCustomerManagementById: (id: string) => Promise<void>;
  customerManagement: (data: CustomerManagement) => Promise<void>;
  clearSelectedService: () => void;
  setIsOpenManagement: () => void;
  setIsCloseManagement: () => void;
}

export const customerManagementStore = create<CustomerManagementStore>((set, get) => ({
  customerManagementList: [],
  selectedService: {} as CustomerServiceById,
  isLoading: false,
  error: null,
  isOpenManagement: false,
  customerServiceId: "",

  fetchCustomerManagementList: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerManagementService.customerManagementList();
      const sortedData = [...response.data].sort((a, b) => a.days_remaining - b.days_remaining);

      set({ customerManagementList: sortedData });
    } catch (error: any) {
      set({ error: error.message || "Error desconocido" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCustomerManagementById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerManagementService.customerManagementById(id);
      if (!response.data) {
        throw new Error("No se encontro el servicio")
      }
      set({ selectedService: response.data });
    } catch (error: any) {
      set({ error: error.message || "Error desconocido" });
    } finally {
      set({ isLoading: false });
    }
  },

  customerManagement: async (data: CustomerManagement) => {
    set({ isLoading: true, error: null });
    try {
      const response = await customerManagementService.CustomerManagement(data);
      if (!response || !response.data) { 
        throw new Error("La operación de gestión de clientes falló o no devolvió datos.");
      }
      await get().fetchCustomerManagementList();
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido durante la gestión de clientes.";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  clearSelectedService: () => {
    set({ selectedService: {} as CustomerServiceById });
  },

  setIsOpenManagement: () => {
    set({ isOpenManagement: true });
  },

  setIsCloseManagement: () => {
    set({ isOpenManagement: false, selectedService: {} as CustomerServiceById });
  }

}))