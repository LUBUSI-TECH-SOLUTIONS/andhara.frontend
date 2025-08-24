import { incomesStore } from "@/app/stores/dashboard_detail/dashboardDetailStore"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/format"

export const ProductSummaryHorizontal = () => {
  const { reports } = incomesStore()
  const products = reports?.products_summary || []

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div>
          <CardTitle className="flex items-center justify-between">
            Resumen por producto
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-2">
            {reports?.products_summary.length || 0} Productos
          </p>
        </div>
      </CardHeader>
      <CardContent className="grid">
        <section className="overflow-x-auto pb-4">
          <div className="flex gap-6 px-1">
            {products.map((product, index) => (
              <div key={index} className="flex-shrink-0 border rounded-lg p-4 bg-card min-w-fit w-[300px]">
                <div className="flex items-center justify-between mb-3 pb-2 font-semibold">
                  <Badge>
                    # {product.rank_position}
                  </Badge>
                  <div className="text-sm font-bold text-muted-foreground">{product.profit_margin.toFixed(1)}%</div>
                </div>
                <div className="mb-4">
                  <h3 className="font-bold text-xl leading-tight">
                    {product.product_name}
                  </h3>
                </div>
                <Separator className="my-2" />
                <div className="gap-6 mb-4 pb-3 border-b border-muted/30">
                  <div className="">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Unidades</div>
                    <div className="text-base font-bold">{product.units_sold}</div>
                  </div>
                  <div className="">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Ventas</div>
                    <div className="text-base font-bold">{formatCurrency(product.total_revenue)}</div>
                  </div>
                  <div className="">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Beneficio</div>
                    <div className="text-xl font-bold">{formatCurrency(product.total_profit)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {products.length > 3 && (
          <div className="text-xs text-muted-foreground text-center mt-2">
            ← Desliza horizontalmente para ver todos los productos →
          </div>
        )}
      </CardContent>
    </Card>
  )
}