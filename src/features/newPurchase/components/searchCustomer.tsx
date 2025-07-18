import { useEffect, useState } from "react"
import type { Customer } from "@/features/customer/types/customerTypes"
import { useCustomerStore } from "@/app/stores/customers/customerStore"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { FormControl } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, User } from "lucide-react"

interface SearchCustomerProps {
  placeholder?: string
}

export function SearchCustomer({
  placeholder = "Buscar cliente...",
}: SearchCustomerProps) {
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const {
    isLoading,
    setSearchWithDebounce,
    setSelectedCustomer,
    filteredCustomers,
  } = useCustomerStore()


  useEffect(() => {
    const trimmed = inputValue.trim()
    if (trimmed !== "") {
      setSearchWithDebounce(inputValue)
    }
  }, [inputValue])

  const handleSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    setSearchWithDebounce(`${customer.customer_first_name} ${customer.customer_last_name}`)
    setIsFocused(false)
  }

  return (
    <div className="col-span-2">
      <div >
        <Label htmlFor="customer" className="mb-2">Cliente</Label>
        <FormControl>
          <Input
            id="customer"
            type="text"
            autoComplete="off"
            placeholder={placeholder}
            onChange={(e) => {
              setInputValue(e.target.value)
              setIsFocused(!!e.target.value)
            }}
            onFocus={() => setIsFocused(true)}
          />
        </FormControl>
      </div>

      {isFocused && (inputValue || isLoading) && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Command className="rounded-lg border shadow-md">
              <CommandList>
                <CommandEmpty>No se enctraron resultados</CommandEmpty>
                <CommandGroup>
                  {(filteredCustomers ?? []).map((customer) => (
                    <CommandItem
                      key={customer.customer_document}
                      value={customer.customer_document}
                      onSelect={() => handleSelect(customer)}
                      disabled={!customer.customer_state}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <User className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span>
                            {customer.customer_first_name} {customer.customer_last_name}
                          </span>
                          <div className="flex text-xs text-muted-foreground">
                            <span className="mr-2">Doc: {customer.customer_document}</span>
                          </div>
                        </div>
                        <Separator orientation="vertical" className="mx-2" />
                        <div className="ml-auto text-xs text-muted-foreground space-x-2">
                          <span>{customer.branch.branch_name}</span>
                          {customer.customer_state === false ? (
                            <Badge variant="destructive">
                              Inactivo
                            </Badge>
                          ) : (
                            <Badge variant="default">
                              Activo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </div>
      )}
    </div>
  )
}
