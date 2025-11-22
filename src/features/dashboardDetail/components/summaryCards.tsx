import { useEffect } from "react"
import { incomesStore } from "@/app/stores/dashboard_detail/dashboardDetailStore"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Target, Users, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export const SummaryCards = () => {
  const { fetchReports, reports, isLoading } = incomesStore()

  const summaryCards = [
    {
      title: "Total Vendido",
      value: formatCurrency(reports?.global_resume.global_financial.total_revenue || 0),
      subtitle: "Total bruto",
      icon: DollarSign,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Total Beneficio",
      value: formatCurrency(reports?.global_resume.global_financial.total_profit || 0),
      subtitle: `${reports?.global_resume.global_financial.profit_margin.toFixed(1) || 0}% margen`,
      icon: Target,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Clientes",
      value: reports?.global_resume.customers.customers_involved || 0,
      subtitle: `Clientes únicos en ${reports?.global_resume.customers.branches_involved || 0} sucursales`,
      extra_data:
        `${reports?.global_resume.customers.total_customers || 0} clientes registrados`,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pedidos",
      value: reports?.global_resume.total_purchases.total_purchases || 0,
      subtitle: "Pedidos únicos",
      extra_data:
        `${reports?.global_resume.total_purchases.products_involved || 0} productos vendidos`,
      icon: ShoppingBag,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    }
  ]

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                  {card.extra_data && (
                    <Badge variant="secondary" className="mt-2 text-[10px] font-normal">
                      {card.extra_data}
                    </Badge>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}