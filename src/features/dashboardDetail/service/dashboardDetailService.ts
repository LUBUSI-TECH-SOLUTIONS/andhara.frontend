import axios, { AxiosHeaders, AxiosResponse } from "axios";
import { SalesReport, SalesReportParams } from "@/features/dashboardDetail/types/incomesTypes";
import { toast } from "sonner";
import apiClient from "@/app/apiClient";

export const dashboardDetailService = {
  getIncomes: async ({
    skip,
    limit,
    id_branch,
    month,
    year,
    start_date,
    end_date
  }: SalesReportParams = {}): Promise<AxiosResponse<SalesReport[]>> => {
    try {
      const response: AxiosResponse<SalesReport[]>
        = await apiClient.get<SalesReport[]>("/v2/incomes/incomes-table", {
          params: { skip, limit, id_branch, month, year, start_date, end_date },
          headers: new AxiosHeaders(),
        })
      if(!response.data || response.data.length === 0) {
        toast.error("No se encontraron ingresos");
      }
      if(response.data.length > 0) {
        toast.success("Ingresos obtenidos correctamente");
      }
      return response
    }catch (error: unknown) {
      let errorMessage = "Error al obtener los ingresos";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}