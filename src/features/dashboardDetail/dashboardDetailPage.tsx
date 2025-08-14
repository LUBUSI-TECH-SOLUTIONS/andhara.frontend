import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SaleFilters } from "@/features/dashboardDetail/components/salesFIlters"
import { GroupedIncomesTable } from "./components/groupedSalesTable"
import { Separator } from "@/components/ui/separator"

export const DashboardDetailPage = () => {
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Detalles del Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SaleFilters />
          <Separator className="my-4" />
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Datos Detallados</CardTitle>
            </CardHeader>
            <CardContent>
              <GroupedIncomesTable />
            </CardContent>
          </Card>
        </CardContent>
      </Card>

    </section>
  )
}