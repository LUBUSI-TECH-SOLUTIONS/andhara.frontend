import apiClient, { ApiResponse } from "@/app/apiClient";
import { SalesReport, SalesReportParams } from "@/features/dashboardDetail/types/incomesTypes";

export const dashboardDetailService = {
  getIncomes: async ({
    skip,
    limit,
    id_branch,
    month,
    year,
    start_date,
    end_date
  }: SalesReportParams = {}): Promise<ApiResponse<SalesReport[]>> => {
    return await apiClient.get<SalesReport[]>("/v2/incomes/incomes-table", {
      params: { skip, limit, id_branch, month, year, start_date, end_date },
    });
  }
}