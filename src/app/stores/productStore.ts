import { create } from "zustand"
import { ProductService } from "@/features/products/services/productService"

import type { Product, ProductTableFilters } from "@/features/products/types/productTypes"
import { SortOption } from "@/lib/utils"

interface ProductState {
  allProducts: Product[] 
  filteredProducts: Product[]
  displayedProducts: Product[]

  total: number
  pageCount: number

  isLoading: boolean
  error: string | null

  filters: ProductTableFilters
  search: string
  sort: SortOption | undefined
  pageIndex: number
  pageSize: number

  editDialogOpen: boolean
  newProductDialogOpen: boolean
  deleteDialogOpen: boolean
  selectedProduct: Product | null
  productIdToDelete: string | null

  fetchProducts: () => Promise<void>
  createProduct: (product: Omit<Product, "id_product">) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  inactivateProduct: (id: string) => Promise<void>
  toggleProductState: (id: string) => Promise<void>
  getSupplierName: (supplierId: string) => string

  setFilters: (filters: Partial<ProductTableFilters>) => void
  clearFilters: () => void
  setSearch: (search: string) => void
  setSort: (sort: SortOption | undefined) => void
  setPageIndex: (index: number) => void
  setPageSize: (size: number) => void

  openEditDialog: (product: Product) => void
  openNewProductDialog: () => void
  openDeleteDialog: (productId: string) => void
  closeEditDialog: () => void
  closeNewProductDialog: () => void
  closeDeleteDialog: () => void

  applyFilters: () => void
  applyPagination: () => void
  applySorting: (products: Product[]) => Product[]
}

const initialFilters: ProductTableFilters = {
  id_supplier: null,
  discount: null,
  minStock: null,
  product_state: null,
}

export const useProductStore = create<ProductState>((set, get) => ({
  allProducts: [],
  filteredProducts: [],
  displayedProducts: [],
  total: 0,
  pageCount: 0,
  isLoading: false,
  error: null,
  filters: { ...initialFilters },
  search: "",
  sort: undefined,
  pageIndex: 0,
  pageSize: 5,

  editDialogOpen: false,
  newProductDialogOpen: false,
  deleteDialogOpen: false,
  selectedProduct: null,
  productIdToDelete: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const products = await ProductService.getProducts()

      set({
        allProducts: products,
        total: products.length,
        pageCount: Math.ceil(products.length / get().pageSize),
      })

      get().applyFilters()

      set({ isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error al cargar productos",
        isLoading: false,
      })
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null })
    try {
      const newProduct = await ProductService.createProduct(productData)

      set((state) => ({
        allProducts: [...state.allProducts, newProduct],
        isLoading: false,
      }))

      await get().fetchProducts()

      get().applyFilters()
      get().closeNewProductDialog()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error al crear producto",
        isLoading: false,
      })
    }
  },

  updateProduct: async (product) => {
    set({ isLoading: true, error: null })
    try {
      const updatedProduct = await ProductService.updateProduct(product)

      set((state) => ({
        allProducts: state.allProducts.map((p) => (p.id_product === updatedProduct.id_product ? updatedProduct : p)),
        isLoading: false,
      }))

      await get().fetchProducts()

      get().applyFilters()
      get().closeEditDialog()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error al actualizar producto",
        isLoading: false,
      })
    }
  },

  inactivateProduct: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await ProductService.inactivateProduct(id)

      await get().fetchProducts()

      get().closeDeleteDialog()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error al inactivar producto",
        isLoading: false,
      })
    }
  },

  toggleProductState: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const product = get().allProducts.find((p) => p.id_product === id)

      if (!product) {
        throw new Error(`Producto con ID ${id} no encontrado`)
      }

      const updatedProduct = await ProductService.toggleProductState(id, product.product_state)

      set((state) => ({
        allProducts: state.allProducts.map((p) => (p.id_product === updatedProduct.id_product ? updatedProduct : p)),
        isLoading: false,
      }))

      await get().fetchProducts()

      get().applyFilters()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Error al cambiar estado del producto",
        isLoading: false,
      })
    }
  },

  getSupplierName: (supplierId) => {
    return ProductService.getSupplierName(supplierId)
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pageIndex: 0,
    }))
    get().applyFilters()
  },

  clearFilters: () => {
    set({
      filters: { ...initialFilters },
      search: "",
      sort: undefined,
      pageIndex: 0,
    })
    get().applyFilters()
  },

  setSearch: (search) => {
    set({ search, pageIndex: 0 })
    get().applyFilters()
  },

  setSort: (sort) => {
    set({ sort, pageIndex: 0 })
    get().applyFilters()
  },

  setPageIndex: (pageIndex) => {
    set({ pageIndex })
    get().applyPagination()
  },

  setPageSize: (pageSize) => {
    set({ pageSize, pageIndex: 0 })
    get().applyFilters()
  },

  openEditDialog: (product) => {
    set({
      selectedProduct: product,
      editDialogOpen: true,
    })
  },

  openNewProductDialog: () => {
    set({ newProductDialogOpen: true })
  },

  openDeleteDialog: (productId) => {
    set({
      productIdToDelete: productId,
      deleteDialogOpen: true,
    })
  },

  closeEditDialog: () => {
    set({
      selectedProduct: null,
      editDialogOpen: false,
    })
  },

  closeNewProductDialog: () => {
    set({ newProductDialogOpen: false })
  },

  closeDeleteDialog: () => {
    set({
      productIdToDelete: null,
      deleteDialogOpen: false,
    })
  },

  applyFilters: () => {
    const { allProducts, filters, search, sort, pageSize } = get()

    let filtered = [...allProducts]

    if (filters.id_supplier) {
      filtered = ProductService.filterProductsBySupplier(filtered, filters.id_supplier)
    }

    if (filters.discount !== null && filters.discount !== undefined) {
      filtered = filtered.filter((p) => p.product_discount >= filters.discount!)
    }

    if (filters.product_state !== null && filters.product_state !== undefined) {
      filtered = filtered.filter((p) => p.product_state === filters.product_state)
    }

    if (filters.minStock !== null && filters.minStock !== undefined) {
      filtered = filtered.filter((p) => {
        const totalStock = p.stock.reduce((sum, item) => sum + item.quantity, 0)
        return totalStock >= filters.minStock!
      })
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.product_name.toLowerCase().includes(searchLower) ||
          p.product_description.toLowerCase().includes(searchLower) ||
          (p.id_product || '').toString().includes(searchLower) ||
          ProductService.getSupplierName(p.id_supplier)
            .toLowerCase()
            .includes(searchLower)
      )
    }

    if (sort) {
      filtered = get().applySorting(filtered)
    }

    const total = filtered.length
    const pageCount = Math.ceil(total / pageSize)

    set({
      filteredProducts: filtered,
      total,
      pageCount,
    })

    get().applyPagination()
  },

  applyPagination: () => {
    const { filteredProducts, pageIndex, pageSize } = get()

    const start = pageIndex * pageSize
    const end = start + pageSize
    const paginatedProducts = filteredProducts.slice(start, end)

    set({ displayedProducts: paginatedProducts })
  },

  applySorting: (products: Product[]): Product[] => {
    const { sort } = get()

    if (!sort) return products

    return [...products].sort((a, b) => {
      const { field, direction } = sort
      const multiplier = direction === "asc" ? 1 : -1

      if (field === "id_supplier") {
        const supplierNameA = ProductService.getSupplierName(a.id_supplier)
        const supplierNameB = ProductService.getSupplierName(b.id_supplier)
        return supplierNameA.localeCompare(supplierNameB) * multiplier
      }

      if (field === "stock") {
        const stockA = a.stock.reduce((sum, item) => sum + item.quantity, 0)
        const stockB = b.stock.reduce((sum, item) => sum + item.quantity, 0)
        return (stockA - stockB) * multiplier
      }

      const valueA = a[field as keyof Product]
      const valueB = b[field as keyof Product]

      if (typeof valueA === "number" && typeof valueB === "number") {
        return (valueA - valueB) * multiplier
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return valueA.localeCompare(valueB) * multiplier
      }

      if (typeof valueA === "boolean" && typeof valueB === "boolean") {
        return (valueA === valueB ? 0 : valueA ? 1 : -1) * multiplier
      }

      return 0
    })
  },
}))
