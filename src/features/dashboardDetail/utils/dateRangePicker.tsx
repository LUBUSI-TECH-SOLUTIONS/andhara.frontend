import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar";

interface DateRangePickerProps {
  value: DateRange | null
  onChange: (dateRange: DateRange | null) => void
}


export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (
            <>
              {format(value.from, "dd/MM/yyyy", { locale: es })} - {value.to ? format(value.to, "dd/MM/yyyy", { locale: es }) : ""}
            </>
          ) : (
            <span>Seleccionar rango</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value?.from}
          selected={value || undefined}
          onSelect={(range) => {
            onChange(range || null)
            if (range?.from && range?.to) {
              setIsOpen(false)
            }
          }}
          numberOfMonths={2}
          locale={es}
        />
        <div className="p-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}>
            Limpiar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}