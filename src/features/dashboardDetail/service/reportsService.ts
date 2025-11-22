import { SalesDashboardResponse, SalesReportParams } from "@/features/dashboardDetail/types/incomesTypes";
import apiClient, { ApiResponse } from "@/app/apiClient";

export const reportsService = {
  getGlobalReport: async ({
    id_branch,
    month,
    year,
    start_date,
    end_date
  }: SalesReportParams): Promise<ApiResponse<SalesDashboardResponse>> => {
    return await apiClient.get<SalesDashboardResponse>("/v2/report/global-summaries", {
      params: { id_branch, month, year, start_date, end_date },
    });
  },

  downloadIncomesReport: async (params: SalesReportParams) => {
    const response = await apiClient.get("/v2/incomes/download-report", {
      params,
      responseType: "blob",
    });
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'reporte.xlsx'

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }

    return { blob: response.data, fileName };
  }
}