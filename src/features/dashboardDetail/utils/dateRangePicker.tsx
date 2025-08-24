import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn, formaterDate } from "@/lib/utils";
import { useState } from "react";
import { DateRange } from "react-day-picker";
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
          className={cn("w-full justify-start text-left font-normal truncate", !value && "text-muted-foreground")}>
          {value?.from ? (
            <>
              {formaterDate(value.from)} - {value.to ? formaterDate(value.to) : "Hasta hoy"}
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