import apiClient from "@/app/apiClient";
import { PurchaseRequest } from "@/features/dashboard/types/purchaseTypes";

export const purchaseService = {
  createPurchase: async (data: PurchaseRequest) => {
    try {
      const response = await apiClient.post("/purchase/create", data);
      return response.data;
    }catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al crear la venta"
      throw new Error(errorMessage)
    }
  }
}