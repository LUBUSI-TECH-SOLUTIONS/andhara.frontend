import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { months } from "@/lib/utils"
import { branchesStatic } from "@/shared/static"
import { DateRangePicker } from "../utils/dateRangePicker"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export const SaleFilters = () => {
  const [date, setDate] = useState<DateRange | null>(null)
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sede</Label>
          <Select>
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
          <Select>
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
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los meses</SelectItem>
              {months.map((month, index) => (
                <SelectItem key={index} value={month}>
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Rango de fechas</Label>
          <DateRangePicker
            value={date} 
            onChange={() => setDate(null)} />
        </div>
         {/* Botón de resetear filtros */}
        <div className="space-y-2 flex flex-col justify-end">
          <Label className="text-sm font-medium">Limpiar</Label>
          <Button
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