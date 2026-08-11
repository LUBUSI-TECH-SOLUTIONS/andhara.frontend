import apiClient, { ApiResponse } from "@/app/apiClient";
import { Customer, CustomerPurchase, CustomerRequest, DiagnosisTypes } from "@/features/customer/types/customerTypes";

export const CustomerService = {
  getCustomers: async ({
    search = "",
    skip = 0,
    limit = 100,
    id_branch,
  }: {
    search?: string;
    skip?: number;
    limit?: number;
    id_branch?: string | null;
  } = {}): Promise<ApiResponse<Customer[]>> => {
    const params: Record<string, string | number> = { search, skip, limit };
    if (id_branch) params.id_branch = id_branch;
    return await apiClient.get<Customer[]>("/v1/customer/customers", {
      params,
    });
  },

  getCustomerPurchase: async (
    document: string | null
  ): Promise<ApiResponse<CustomerPurchase>> => {
    return await apiClient.get<CustomerPurchase>(`/v1/customer/purchases`, {
      params: { document },
    });
  },

  createCostumer: async (
    client: CustomerRequest
  ): Promise<ApiResponse<Customer>> => {
    return await apiClient.post<Customer>("/v1/customer/create-customer", client);
  },

  updateCustomer: async (
    clientData: CustomerRequest
  ): Promise<ApiResponse<Customer>> => {
    return await apiClient.patch<Customer>(`/v1/customer/update-customer/${clientData.customer_document}`, clientData);
  },

  toggleCustomer: async (
    document: string,
    status: boolean
  ): Promise<ApiResponse<Customer>> => {
    return await apiClient.patch(`/v1/customer/toggle-customer/${document}?activate=${status}`);
  },

  // Diagnostics
  getCustomerDiagnostics: async (): Promise<ApiResponse<DiagnosisTypes[]>> => {
    return await apiClient.get<DiagnosisTypes[]>("/v2/diagnoses/list-all");
  }
}

