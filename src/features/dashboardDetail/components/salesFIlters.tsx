import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { months } from "@/lib/utils"
import { branchesStatic } from "@/shared/static"
import { DateRangePicker } from "@/features/dashboardDetail/utils/dateRangePicker"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { incomesStore } from "@/app/stores/dashboard_detail/dashboardDetailStore"

export const SaleFilters = () => {
  const { setFilters, resetFilters } = incomesStore()

  const [dateRange, setDateRange] = useState<DateRange | null>(null)

  // Estados controlados para cada select
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  const handleReset = () => {
    resetFilters()
    setDateRange(null)

    // Reset visual de selects
    setSelectedBranch(null)
    setSelectedYear(null)
    setSelectedMonth(null)
  }

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">

        {/* Sede */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sede</Label>
          <Select
            value={selectedBranch ?? ''}
            onValueChange={(value) => {
              setSelectedBranch(value)
              setFilters({ id_branch: value })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar sede" />
            </SelectTrigger>
            <SelectContent>
              {branchesStatic.map(branch => (
                <SelectItem key={branch.id_branch} value={branch.id_branch}>
                  {branch.branch_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Año */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Año</Label>
          <Select
            value={selectedYear ?? ''}
            onValueChange={(value) => {
              setSelectedYear(value)
              setFilters({ year: value === "all" ? undefined : Number(value) })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los años</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mes */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Mes</Label>
          <Select
            value={selectedMonth ?? ''}
            onValueChange={(value) => {
              setSelectedMonth(value)
              setFilters({ month: value === "all" ? undefined : Number(value) })
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los meses</SelectItem>
              {months.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fecha */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Fecha</Label>
          <DateRangePicker
            value={dateRange}
            onChange={(range: DateRange | null) => {
              setDateRange(range)
              if (range?.from && range?.to) {
                setFilters({
                  start_date: range.from.toISOString(),
                  end_date: range.to.toISOString(),
                })
              }
            }}
          />
        </div>

        {/* Botón Limpiar */}
        <div className="space-y-2 flex flex-col justify-end">
          <Label className="text-sm font-medium">Limpiar</Label>
          <Button
            onClick={handleReset}
            variant="outline"
            size="default"
            className="gap-2 bg-transparent hover:bg-muted/50 border-muted-foreground/20"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>

      </div>
    </section>
  )
}
