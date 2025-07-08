import { useCustomerStore } from "@/app/stores/customers/customerStore"
import React, { useEffect, useRef, useState } from "react"
import { typesDocument } from "@/shared/static"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { branchesStatic } from "@/shared/static"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileStack, Search, Store } from "lucide-react"

export const CustomersFilters = () => {
  const { filters, search, setFilters, setSearch, isLoading, clearFilters, fetchCustomers } = useCustomerStore()
  const [localSearch, setLocalSearch] = useState(search)

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (search !== localSearch) {
      setLocalSearch(search)
    }
  }, [search])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setLocalSearch(value)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setSearch(value)
      fetchCustomers()
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 py-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={localSearch}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.branch?.branch_name || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                setFilters({ branch: null })
              } else {
                const selectedBranch = branchesStatic.find(branch => branch.branch_name === value);
                console.log("Branch",filters, "branch", selectedBranch)
                setFilters({ branch: selectedBranch ?? null })
              }
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecciona una sede" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <Store className="mr-2 h-4 w-4" />
                Todas las sedes
                </SelectItem>
              {branchesStatic.map(branch => (
                <SelectItem key={branch.id_branch} value={branch.branch_name}>
                  {branch.branch_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.document_type?.toString() || "all"}
            onValueChange={(value) => setFilters({document_type: value === "all" ? null : value})}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecciona un documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <FileStack className="-4 w-4" />
                Todos los documentos
                </SelectItem>
              {
                typesDocument.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) =>{
          if(value === null) return null
          let label = ""
          if(key === "branch"){label = `Sede: ${value.branch_name}`}
          if(key === "document_type"){label = `Tipo de documento: ${typesDocument.find(d => d.id === value)?.name}`}

          return(
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              {label}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setFilters({ [key]: null })}
                disabled={isLoading}
              >
                ×
              </Button>
            </Badge>
          )
        })}
        {(Object.values(filters).some((v) => v !== null) || search) && (
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={clearFilters} disabled={isLoading}>
            Limpiar filtros
          </Button>
        )}
      </div>
    </section>
  )
}

