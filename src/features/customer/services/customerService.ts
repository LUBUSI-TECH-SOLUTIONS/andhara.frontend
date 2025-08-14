import apiClient from "@/app/apiClient";
import { Customer, CustomerPurchase, CustomerRequest } from "@/features/customer/types/customerTypes";
import axios, { AxiosHeaders } from "axios";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

export const CustomerService = {
  getCustomers: async ({
    search = "",
    skip = 0,
    limit = 100
  } = {}): Promise<AxiosResponse<Customer[]>> => {
    try {
      const response: AxiosResponse<Customer[]>
        = await apiClient.get<Customer[]>("/v1/customer/customers", {
          params: { search, skip, limit },
          headers: new AxiosHeaders(),
        })
      if (!response.data || response.data.length === 0) {
        toast.error("No se encontraron clientes");
      }
      if (response.data.length > 0) {
        toast.success("Clientes obtenidos correctamente");
      }
      return response
    } catch (error: unknown) {
      let errorMessage = "Error al obtener los clientes";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  getCustomerPurchase: async (
    document: string | null
  ): Promise<AxiosResponse<CustomerPurchase>> => {
    try {
      const response: AxiosResponse<CustomerPurchase>
        = await apiClient.get<CustomerPurchase>(`/v1/customer/purchases`, {
          params: { document },
          headers: new AxiosHeaders(),
        })
      if (!response.data) {
        toast.error("No se encontraron compras para este cliente");
      }
      if (response.data) {
        toast.success("Compras del cliente obtenidas correctamente");
      }
      return response
    } catch (error: unknown) {
      let errorMessage = "Error al obtener las compras del cliente";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  createCostumer: async (
    client: CustomerRequest
  ): Promise<AxiosResponse<Customer>> => {
    try {
      const response: AxiosResponse<Customer>
        = await apiClient.post<Customer>("/v1/customer/create-customer", client)
      if (response.status === 201) {
        toast.success("Cliente creado correctamente");
      }
      return response
    } catch (error: unknown) {
      let errorMessage = "Error al crear el cliente";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateCustomer: async (
    clientData: CustomerRequest
  ): Promise<AxiosResponse<Customer>> => {
    try {
      const response
        : AxiosResponse<Customer>
        = await apiClient.patch<Customer>(`/v1/customer/update-customer/${clientData.customer_document}`, clientData)
      if (response.status === 200) {
        toast.success("Cliente actualizado correctamente");
      }
      return response
    } catch (error: unknown) {
      let errorMessage = "Error al actualizar el cliente";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  toggleCustomer: async (
    document: string
  ): Promise<AxiosResponse<Customer>> => {
    try {
      const response
        : AxiosResponse<Customer>
        = await apiClient.patch(`/v1/customer/toggle-customer/${document}`)
      if (response.status === 200) {
        toast.success("Estado del cliente cambiado correctamente");
      }
      return response
    } catch (error: unknown) {
      let errorMessage = "Error al cambiar el estado del cliente";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
}

