import { useState, useEffect, useCallback } from "react"
import type { Table } from "@tanstack/react-table"
import type { Product } from "@/features/products/types/productTypes"

/**
 * Represents the visibility state of table columns,
 * where each key is a column ID and the value is a boolean indicating visibility.
 */
export type ColumnVisibilityState = Record<string, boolean>

/**
 * Metadata for a table column, used to define label, visibility rules, and hideability.
 */
export interface ColumnMeta {
  id: string
  label: string
  description?: string
  defaultVisible: boolean
  canHide: boolean
}

/**
 * Predefined configuration for product table columns,
 * including default visibility and whether they can be hidden.
 */
export const PRODUCT_COLUMNS: ColumnMeta[] = [
  { id: "id_product", label: "ID", defaultVisible: true, canHide: true },
  { id: "product_name", label: "Producto", defaultVisible: true, canHide: false },
  { id: "product_description", label: "Descripción", defaultVisible: true, canHide: true },
  { id: "id_supplier", label: "Proveedor", defaultVisible: true, canHide: true },
  { id: "purchase_price", label: "Precio Compra", defaultVisible: true, canHide: true },
  { id: "product_discount", label: "Descuento", defaultVisible: true, canHide: true },
  { id: "sale_price", label: "Precio Venta", defaultVisible: true, canHide: true },
  { id: "profit_margin", label: "Margen", defaultVisible: true, canHide: true },
  { id: "vat", label: "IVA", defaultVisible: false, canHide: true },
  { id: "product_state", label: "Estado", defaultVisible: true, canHide: true },
  { id: "stock", label: "Stock", defaultVisible: true, canHide: true },
  { id: "actions", label: "Acciones", defaultVisible: true, canHide: false },
]

const STORAGE_KEY = "product-table-column-visibility"

/**
 * Custom hook to manage column visibility for a product table.
 * It syncs visibility state with localStorage and the React Table instance.
 *
 * @param {Table<Product>} table - The table instance from @tanstack/react-table.
 * @returns {{
 *   columnVisibility: ColumnVisibilityState,
 *   setColumnVisibility: (value: ColumnVisibilityState) => void,
 *   toggleColumnVisibility: (columnId: string) => void,
 *   resetColumnVisibility: () => void,
 *   showAllColumns: () => void,
 *   hideAllColumns: () => void,
 * }} Object with current visibility state and control functions.
 *
 * @example
 * const { toggleColumnVisibility, resetColumnVisibility } = useColumnVisibility(table);
 */
export function useColumnVisibility(table: Table<Product>) {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(() => {
    try {
      const savedVisibility = localStorage.getItem(STORAGE_KEY)
      if (savedVisibility) {
        return JSON.parse(savedVisibility)
      }
    } catch (error) {
      console.error("Error loading column visibility from localStorage:", error)
    }

    return PRODUCT_COLUMNS.reduce((acc, column) => {
      acc[column.id] = column.defaultVisible
      return acc
    }, {} as ColumnVisibilityState)
  })

  useEffect(() => {
    table.setColumnVisibility(columnVisibility)
  }, [table, columnVisibility])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columnVisibility))
    } catch (error) {
      console.error("Error saving column visibility to localStorage:", error)
    }
  }, [columnVisibility])

  /**
   * Toggles visibility of a specific column.
   *
   * @param {string} columnId - The ID of the column to toggle.
   */
  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }, [])

  /**
   * Resets visibility to default settings defined in PRODUCT_COLUMNS.
   */
  const resetColumnVisibility = useCallback(() => {
    const defaultVisibility = PRODUCT_COLUMNS.reduce((acc, column) => {
      acc[column.id] = column.defaultVisible
      return acc
    }, {} as ColumnVisibilityState)

    setColumnVisibility(defaultVisibility)
  }, [])

  /**
   * Sets all hideable columns to visible.
   */
  const showAllColumns = useCallback(() => {
    const allVisible = PRODUCT_COLUMNS.reduce((acc, column) => {
      if (column.canHide) {
        acc[column.id] = true
      }
      return acc
    }, {} as ColumnVisibilityState)

    setColumnVisibility((prev) => ({
      ...prev,
      ...allVisible,
    }))
  }, [])

  /**
   * Hides all columns that are allowed to be hidden.
   */
  const hideAllColumns = useCallback(() => {
    const allHidden = PRODUCT_COLUMNS.reduce((acc, column) => {
      if (column.canHide) {
        acc[column.id] = false
      }
      return acc
    }, {} as ColumnVisibilityState)

    setColumnVisibility((prev) => ({
      ...prev,
      ...allHidden,
    }))
  }, [])

  return {
    columnVisibility,
    setColumnVisibility,
    toggleColumnVisibility,
    resetColumnVisibility,
    showAllColumns,
    hideAllColumns,
  }
}
