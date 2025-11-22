import apiClient, { ApiResponse } from "@/app/apiClient";
import { CustomerManagement, CustomerService, CustomerServiceById } from "@/features/dashboard/types/purchaseTypes";

export const customerManagementService = {
	customerManagementList: async (): Promise<ApiResponse<CustomerService[]>> => {
		return await apiClient.get("/v1/customer-service/list-all");
	},

	customerManagementById: async (id: string): Promise<ApiResponse<CustomerServiceById>> => {
		return await apiClient.get(`/v1/customer-service/get-by-id/${id}`);
	},

	CustomerManagement: async (data: CustomerManagement): Promise<ApiResponse> => {
		return await apiClient.patch(`/v1/customer-service/manage/${data.id_customer_service}`, {
			contact_comment: data.contact_comment,
			customer_service_status: data.customer_service_status,
		});
	}
}