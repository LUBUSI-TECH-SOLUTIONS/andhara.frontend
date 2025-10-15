import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Row } from "@tanstack/react-table"
import { FileText, Info } from "lucide-react"
import { Customer } from "../types/customerTypes"

interface CustomerDiagnosisProps {
  row: Row<Customer>;
  triggerText?: string;
}

export const CustomerDiagnosis = ({
  row,
  triggerText = "Diagnósticos"
}: CustomerDiagnosisProps) => {
  const diagnoses = row.original.customer_diagnosis;
  
  return (
      <Popover>
      <PopoverTrigger asChild>
        <Button size={"sm"} variant="ghost" className="gap-2 bg-transparent">
          {triggerText}
          <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            {diagnoses?.length}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Diagnósticos del Paciente</h3>
          </div>

          {diagnoses?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Info className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No hay diagnósticos registrados</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {diagnoses?.map((diagnosis, index) => (
                <div
                  key={diagnosis.id_customer_diagnosis}
                  className="rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-medium leading-tight text-card-foreground">
                        {diagnosis.diagnosis_name}
                      </h4>
                      {diagnosis.diagnosis_description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {diagnosis.diagnosis_description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground font-mono">
                        ID: {diagnosis.id_diagnosis.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}