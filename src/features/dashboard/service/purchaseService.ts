import apiClient, { ApiResponse } from "@/app/apiClient";
import { PurchaseRequest } from "@/features/dashboard/types/purchaseTypes";

export const purchaseService = {
  createPurchase: async (data: PurchaseRequest): Promise<ApiResponse> => {
    return await apiClient.post("/v1/purchase/create", data);
  }
}