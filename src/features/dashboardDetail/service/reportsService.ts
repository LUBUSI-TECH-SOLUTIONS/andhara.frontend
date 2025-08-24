import { SalesDashboardResponse, SalesReportParams } from "@/features/dashboardDetail/types/incomesTypes";
import axios, { AxiosHeaders, AxiosResponse } from "axios";
import apiClient from "@/app/apiClient";
import { toast } from "sonner";

export const reportsService = {
  getGlobalReport: async ({
    id_branch,
    month,
    year,
    start_date,
    end_date
  }: SalesReportParams) => {
    try {
      const response: AxiosResponse<SalesDashboardResponse>
        = await apiClient.get<SalesDashboardResponse>("/v2/report/global-summaries", {
          params: { id_branch, month, year, start_date, end_date },
          headers: new AxiosHeaders(),
        })
      if(!response.data) {
        toast.error("No se encontraron ingresos");
      }
      if(response.data) {
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