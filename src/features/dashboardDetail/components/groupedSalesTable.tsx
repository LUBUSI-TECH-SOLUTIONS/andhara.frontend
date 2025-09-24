import { useCallback, useEffect, useRef } from "react";
import { incomesStore } from "@/app/stores/dashboard_detail/dashboardDetailStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { formaterDate } from "@/lib/utils";
import React from "react";
import { ReportsButton } from "./groupedExportButton";

export const GroupedIncomesTable = () => {
  const {
    incomes,
    fetchNext,
    isLoading,
    hasMore,
    toggleRow,
    toggleExpandAll,
    expandedRows,
    expandAll,
  } = incomesStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        fetchNext();
      }
    },
    [fetchNext, hasMore, isLoading]
  );

  useEffect(() => {
    const container = scrollRef.current;
    const target = sentinelRef.current;
    if (!container || !target) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: container,
      rootMargin: "200px 0px",
      threshold: 0,
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (incomes.length === 0 && !isLoading) {
      fetchNext()
    }
  }, [incomes.length, isLoading, fetchNext]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground hidden sm:block">
          {incomes.length} registros agrupados por fecha y sede
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={toggleExpandAll}
            className="text-sm bg-transparent"
          >
            {expandAll ? "Contraer Todo" : "Expandir Todo"}
          </Button>
          <ReportsButton />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="w-full h-[70vh] overflow-y-auto border rounded-lg bg-background"
      >
        <Table className="min-w-full">
          <TableHeader
            className="sticky top-0 z-50"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 50,
              backgroundColor: "hsl(var(--background))",
              borderBottom: "2px solid hsl(var(--border))",
              boxShadow: "0 2px 4px -1px rgba(0,0,0,0.1)",
            }}
          >
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Fecha</TableHead>
              <TableHead>Sede</TableHead>
              <TableHead className="text-right">Productos</TableHead>
              <TableHead className="text-right">Total Cantidad</TableHead>
              <TableHead className="text-right">Total Ganancia</TableHead>
              <TableHead className="text-right">Total Neta</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {incomes.map((income, index) => {
              const rowKey = `${income.date}|${income.location}|${index}`; // 👈 keys estables
              const isExpanded = expandedRows?.has(rowKey);

              return (
                <React.Fragment key={rowKey}>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleRow(rowKey)}
                  >
                    <TableCell className="py-3 w-12">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-muted"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{formaterDate(income.date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {income.location.replace("Sede ", "")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{income.products_sold}</TableCell>
                    <TableCell className="text-right">{income.total_quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(income.total_profit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(income.total_net)}
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <>
                      <TableRow className="bg-muted/20">
                        <TableCell />
                        <TableCell colSpan={6}>
                          Productos vendidos el {formaterDate(income.date)} en {income.location}:
                        </TableCell>
                      </TableRow>

                      {income.products.map((p, pi) => (
                        <TableRow key={`${rowKey}::${pi}`} className="bg-muted/10">
                          <TableCell />
                          <TableCell className="pl-8">
                            <span className="text-muted-foreground mr-2">●</span>
                            {p.name}
                          </TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell className="text-right">{p.units_sold}</TableCell>
                          <TableCell className="text-right">{formatCurrency(p.profit)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(p.net)}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>

        <div
          ref={sentinelRef}
          className="py-4 min-h-[1px] flex items-center justify-center"
        >
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Cargando más datos…</span>
            </div>
          )}
        </div>

        {!hasMore && incomes.length > 0 && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            No hay más registros
          </div>
        )}
      </div>
    </div>
  );
};
