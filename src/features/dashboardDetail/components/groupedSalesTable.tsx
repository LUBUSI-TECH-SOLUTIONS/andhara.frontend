import { incomesStore } from "@/app/stores/dashboard_detail/incomesStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";
import { cn, formaterDate } from "@/lib/utils";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

export const GroupedIncomesTable = () => {
  const {
    incomes,
    fetchIncomes,
    isLoading,
    hasMore,
    toggleRow,
    toggleExpandAll,
    expandedRows,
    currentPage,
    totalPages,
    totalRecords,
    expandAll
  } = incomesStore();

  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isLoading) {
        fetchIncomes();
      }
    }, [fetchIncomes, hasMore, isLoading]
  )

  useEffect(() => {
    const element = observerRef.current
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    })
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver])

  useEffect(() => {
    if (incomes.length === 0) {
      fetchIncomes();
    }
  }, [incomes.length, fetchIncomes]);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {totalRecords} registros agrupados por fecha y sede (Página {currentPage} de {totalPages})
        </p>
        <Button variant="outline" size="sm" onClick={toggleExpandAll} className="text-sm bg-transparent">
          {expandAll ? "Contraer Todo" : "Expandir Todo"}
        </Button>
      </div>
      <div>
        <div className="relative">
          <div className="w-full overflow-x-auto max-h-[60vh] border rounded-lg bg-background">
            <div className="min-w-full">
              <Table className="relative">
                <TableHeader
                  className="sticky top-0 z-50"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    backgroundColor: "hsl(var(--background))",
                    borderBottom: "2px solid hsl(var(--border))",
                    boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <TableRow className="hover:bg-muted/50 transition-colors">
                    <TableHead
                      className="w-12 font-semibold text-foreground bg-background border-r border-border"
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "hsl(var(--background))",
                        zIndex: 51,
                        minWidth: "48px",
                        maxWidth: "48px",
                      }}
                    ></TableHead>
                    <TableHead
                      className="font-semibold text-foreground bg-background border-r border-border"
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "hsl(var(--background))",
                        zIndex: 51,
                        minWidth: "140px",
                      }}
                    >Fecha</TableHead>
                    <TableHead className="font-semibold text-foreground bg-background border-r border-border">Sede</TableHead>
                    <TableHead className="text-right font-semibold text-foreground bg-background border-r border-border">Productos</TableHead>
                    <TableHead className="text-right font-semibold text-foreground bg-background border-r border-border">Total Cantidad</TableHead>
                    <TableHead className="text-right font-semibold text-foreground bg-background border-r border-border">Total Ganancia</TableHead>
                    <TableHead className="font-semibold text-foreground bg-background border-r border-border">Total Neta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomes.map((income, index) => {
                    const rowKey = `${income.date}-${income.location}-${index}`
                    const isExpanded = expandedRows?.has(rowKey)

                    return (
                      <>
                        <TableRow
                          key={rowKey}
                          className="cursor-pointer hover:bg-muted/50 border-b border-muted/30 transition-colors"
                          onClick={() => toggleRow(rowKey)}
                        >
                          <TableCell
                            className="py-3 w-12 border-r border-border/50"
                            style={{ minWidth: "48px", maxWidth: "48px" }}>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted">
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                          <TableCell
                            className="font-medium py-3 border-r border-border/50"
                            style={{ minWidth: "140px" }}>
                            {formaterDate(income.date)}
                          </TableCell>
                          <TableCell className="py-3 border-r border-border/50" style={{ minWidth: "120px" }}>
                            <Badge variant="outline" className="whitespace-nowrap">
                              {income.location.replace("Sede ", "")}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className="text-right py-3 border-r border-border/50"
                            style={{ minWidth: "100px" }}>
                            {income.products_sold}
                          </TableCell>
                          <TableCell
                            className="text-right font-medium py-3 border-r border-border/50"
                            style={{ minWidth: "140px" }}>
                            {income.total_quantity}
                          </TableCell>
                          <TableCell
                            className="text-right font-medium py-3 border-r border-border/50"
                            style={{ minWidth: "160px" }}>
                            {formatCurrency(income.total_profit)}
                          </TableCell>
                          <TableCell
                            className="text-right font-medium py-3"
                            style={{ minWidth: "140px" }}>
                            {formatCurrency(income.total_net)}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <>
                            {/* Fila de encabezados de productos */}
                            <TableRow className="bg-muted/20 border-b border-muted/30">
                              <TableCell className="py-2 border-r border-border/50"></TableCell>
                              <TableCell colSpan={6} className="text-sm font-medium text-muted-foreground py-2">
                                Productos vendidos el {formaterDate(income.date)} en {income.location.replace("Sede ", "")}:
                              </TableCell>
                            </TableRow>

                            {/* Filas individuales de cada producto */}
                            {income.products.map((producto, productIndex) => (
                              <TableRow key={`${productIndex}`} className="bg-muted/10 border-b border-muted/20">
                                <TableCell className="py-2 border-r border-border/50"></TableCell>
                                <TableCell className="pl-8 py-2 border-r border-border/50" style={{ minWidth: "140px" }}>
                                  <span className="text-muted-foreground mr-2">●</span>
                                  <span className="text-sm">{producto.name}</span>
                                </TableCell>
                                <TableCell className="py-2 border-r border-border/50"></TableCell>
                                <TableCell className="py-2 border-r border-border/50"></TableCell>
                                <TableCell
                                  className="text-right py-2 border-r border-border/50"
                                  style={{ minWidth: "140px" }}
                                >
                                  {producto.units_sold.toLocaleString()}
                                </TableCell>
                                <TableCell
                                  className="text-right py-2 border-r border-border/50"
                                  style={{ minWidth: "160px" }}
                                >
                                  {formatCurrency(producto.profit)}
                                </TableCell>
                                <TableCell className="text-right py-2" style={{ minWidth: "140px" }}>
                                  {formatCurrency(producto.net)}
                                </TableCell>
                              </TableRow>
                            ))}

                            {/* Fila separadora */}
                            <TableRow className="border-b-2 border-muted/50">
                              <TableCell colSpan={7} className="h-2 p-0"></TableCell>
                            </TableRow>
                          </>
                        )}
                      </>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Loading indicator and infinite scroll trigger */}
          <div ref={observerRef} className={cn("flex items-center justify-center py-4", !hasMore && "hidden")}>
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Cargando más datos...</span>
              </div>
            )}
          </div>

          {!hasMore && incomes.length > 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No hay más registros para mostrar
            </div>
          )}
        </div>
      </div>
    </div>
  )

}

