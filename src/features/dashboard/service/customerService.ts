import apiClient from "@/app/apiClient";
import { AxiosResponse } from "axios";
import { CustomerManagement, CustomerService, CustomerServiceById } from "@/features/dashboard/types/purchaseTypes";

export const customerManagementService = {
	customerManagementList: async (): Promise<AxiosResponse<CustomerService[]>> => {
		try {
			const response: AxiosResponse<CustomerService[]> = await apiClient.get("/customer-service/list-all");
			return response;
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || "Error al obtener la lista de clientes"
			throw new Error(errorMessage)
		}
	},

	customerManagementById: async (id: string): Promise<AxiosResponse<CustomerServiceById>> => {
		try {
			const response: AxiosResponse<CustomerServiceById> = await apiClient.get(`/customer-service/get-by-id/${id}`);
			return response;
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || "Error al obtener el cliente"
			throw new Error(errorMessage)
		}
	},

	CustomerManagement: async (data: CustomerManagement): Promise<AxiosResponse> => {
		try {
			const response: AxiosResponse = await apiClient.patch(`/customer-service/manage/${data.id_customer_service}`, {
				contact_comment: data.contact_comment,
				customer_service_status: data.customer_service_status,
			});
			return response;
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || "Error al actualizar el customer service"
			throw new Error(errorMessage)
		}
	}
}