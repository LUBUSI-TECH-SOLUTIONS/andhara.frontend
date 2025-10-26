import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SaleFilters } from "@/features/dashboardDetail/components/salesFIlters"
import { GroupedIncomesTable } from "@/features/dashboardDetail/components/groupedSalesTable"
import { SummaryCards } from "@/features/dashboardDetail/components/summaryCards"
import { ProductSummaryHorizontal } from "@/features/dashboardDetail/components/productSummaryHorizontal"

export const DashboardDetailPage = () => {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold ">
            Detalles del Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SaleFilters />
          <SummaryCards />
          <ProductSummaryHorizontal />
          <GroupedIncomesTable />
        </CardContent>
      </Card>
    </section>
  )
}