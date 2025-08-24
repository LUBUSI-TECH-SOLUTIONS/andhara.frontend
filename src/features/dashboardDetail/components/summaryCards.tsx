import { useEffect } from "react"
import { incomesStore } from "@/app/stores/dashboard_detail/dashboardDetailStore"
import { formatCurrency } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Target, Users } from "lucide-react"

export const SummaryCards = () => {
  const { fetchReports, reports } = incomesStore()

  const summaryCards = [
    {
      title: "Total Vendido",
      value: formatCurrency(reports?.global_resume.global_financial.total_revenue || 0),
      subtitle: "Total bruto",
      icon: DollarSign,
      color: "text-purple-500",
    },
    {
      title: "Total Beneficio",
      value: formatCurrency(reports?.global_resume.global_financial.total_profit || 0),
      subtitle: `${reports?.global_resume.global_financial.profit_margin.toFixed(1) || 0}% margen`,
      icon: Target,
      color: "text-green-500",
    },
    {
      title: "Clientes",
      value: reports?.global_resume.customers.total_customers || 0,
      subtitle: "Clientes únicos",
      icon: Users,
      color: "text-blue-500",
    }
  ]

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <section className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {summaryCards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}