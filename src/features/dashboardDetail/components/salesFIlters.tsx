import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { months } from "@/lib/utils"
import { branchesStatic } from "@/shared/static"
import { DateRangePicker } from "../utils/dateRangePicker"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { incomesStore } from "@/app/stores/dashboard_detail/incomesStore"

export const SaleFilters = () => {
  const { setFilters, resetFilters } = incomesStore()
  const [dateRange, setDateRange] = useState<DateRange | null>(null)

  const handleReset = () => {
    console.log("Resetting filters")
    resetFilters()
    setDateRange(null)
  }
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sede</Label>
          <Select onValueChange={(value) => setFilters({ id_branch: value })}>
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
        <div className="space-y-2">
          <Label className="text-sm font-medium">Año</Label>
          <Select onValueChange={(value) => setFilters({ year: value === "all" ? undefined : Number(value) })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los años</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Mes</Label>
          <Select onValueChange={(value) => setFilters({ month: value === ' ' ? undefined : Number(value) })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={' '}>Todos los meses</SelectItem>
              {months.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Fecha</Label>
          <DateRangePicker
            value={dateRange}
            onChange={(range: DateRange | null) => {
              setDateRange(range)
              if (range && range.from && range.to) {
                setFilters({
                  start_date: range.from.toISOString(),
                  end_date: range.to.toISOString(),
                })
              }
            }} />
        </div>
        {/* Botón de resetear filtros */}
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