import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SaleFilters } from "@/features/dashboardDetail/components/salesFIlters"

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
        </CardContent>
      </Card>

    </section>
  )
}